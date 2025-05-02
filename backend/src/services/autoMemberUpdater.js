const db = require('../config/db');

// ✅ Auto-load members into FT and NC based on date logic with cleanup
const populateFromMembers = async () => {
  try {
    // ✅ Cleanup: Remove members from new_converts if they now qualify as first_timers
    await db.query(`
      DELETE FROM new_converts
      WHERE member_id IN (
        SELECT id FROM members
        WHERE date_joined_church >= NOW() - INTERVAL '21 days'
          AND date_born_again <= NOW() - INTERVAL '42 days'
      );
    `);

    // ✅ Cleanup: Remove members from first_timers if they now qualify as new_converts
    await db.query(`
      DELETE FROM first_timers
      WHERE member_id IN (
        SELECT id FROM members
        WHERE date_joined_church >= NOW() - INTERVAL '21 days'
          AND date_born_again > NOW() - INTERVAL '42 days'
      );
    `);

    // ✅ First Timers: joined <21 days ago, born again >42 days ago
    await db.query(`
      INSERT INTO first_timers (member_id, registration_date, how_heard)
      SELECT m.id, m.date_joined_church, 'auto-detected'
      FROM members m
      WHERE m.date_joined_church >= NOW() - INTERVAL '21 days'
        AND m.date_born_again <= NOW() - INTERVAL '42 days'
        AND m.id NOT IN (SELECT member_id FROM first_timers);
    `);

    await db.query(`
      UPDATE members
      SET member_type = 'first_timer', status = 'active'
      WHERE date_joined_church >= NOW() - INTERVAL '21 days'
        AND date_born_again <= NOW() - INTERVAL '42 days'
        AND member_type IS DISTINCT FROM 'first_timer';
    `);

    // ✅ New Converts: joined <21 days ago, born again ≤42 days ago
    await db.query(`
      INSERT INTO new_converts (member_id, conversion_date, conversion_type, baptism_scheduled)
      SELECT m.id, m.date_born_again, 'Salvation', false
      FROM members m
      WHERE m.date_joined_church >= NOW() - INTERVAL '21 days'
        AND m.date_born_again > NOW() - INTERVAL '42 days'
        AND m.id NOT IN (SELECT member_id FROM new_converts);
    `);

    await db.query(`
      UPDATE members
      SET member_type = 'new_convert', status = 'active'
      WHERE date_joined_church >= NOW() - INTERVAL '21 days'
        AND date_born_again > NOW() - INTERVAL '42 days'
        AND member_type IS DISTINCT FROM 'new_convert';
    `);

    console.log('[✔] Members populated into FT & NC tables (with cleanup)');
  } catch (err) {
    console.error('[❌] Error in populateFromMembers:', err.message, err.stack);
    throw err;
  }
};

// ✅ Promote First Timers after 21 days
const updateFirstTimers = async () => {
  try {
    await db.query(`
      INSERT INTO first_timer_archive (member_id, registration_date, how_heard)
      SELECT member_id, registration_date, how_heard
      FROM first_timers
      WHERE registration_date <= NOW() - INTERVAL '21 days';
    `);

    await db.query(`
      UPDATE members
      SET member_type = 'member', status = 'active'
      WHERE id IN (
        SELECT member_id FROM first_timers
        WHERE registration_date <= NOW() - INTERVAL '21 days'
      )
      AND member_type = 'first_timer';
    `);

    await db.query(`
      DELETE FROM first_timers
      WHERE registration_date <= NOW() - INTERVAL '21 days';
    `);

    console.log('[✔] First Timers upgraded and archived');
  } catch (err) {
    console.error('[❌] Error in updateFirstTimers:', err.message, err.stack);
    throw err;
  }
};

// ✅ Promote New Converts after 42 days using dynamic milestone logic
const updateNewConverts = async () => {
  try {
    console.log('[🔁] Updating New Converts using milestone_templates...');

    const eligibleMembersCTE = `
      WITH required AS (
        SELECT name FROM milestone_templates WHERE required_for_promotion = TRUE
      ),
      completed AS (
        SELECT member_id, COUNT(DISTINCT milestone_name) AS milestones_done
        FROM milestone_records
        WHERE milestone_name IN (SELECT name FROM required)
        GROUP BY member_id
      ),
      eligible_members AS (
        SELECT c.member_id
        FROM completed c
        JOIN required r ON TRUE
        GROUP BY c.member_id, c.milestones_done
        HAVING COUNT(r.name) = c.milestones_done
      )
    `;

    // ✅ Promote eligible members to 'member' (active)
    await db.query(`
      ${eligibleMembersCTE}
      UPDATE members
      SET member_type = 'member', status = 'active'
      WHERE id IN (
        SELECT member_id FROM eligible_members
      )
      AND member_type = 'new_convert'
      AND id IN (
        SELECT member_id FROM new_converts
        WHERE conversion_date <= NOW() - INTERVAL '42 days'
      );
    `);

    // ✅ Promote ineligible members to 'member' (inactive)
    await db.query(`
      ${eligibleMembersCTE}
      UPDATE members
      SET member_type = 'member', status = 'inactive'
      WHERE id IN (
        SELECT member_id FROM new_converts
        WHERE conversion_date <= NOW() - INTERVAL '42 days'
        AND member_id NOT IN (SELECT member_id FROM eligible_members)
      )
      AND member_type = 'new_convert';
    `);

    // ✅ Archive all processed New Converts
    await db.query(`
      INSERT INTO new_convert_archive (
        member_id, conversion_date, conversion_type,
        baptism_scheduled, baptism_date, archived_at
      )
      SELECT member_id, conversion_date, conversion_type,
             baptism_scheduled, baptism_date, NOW()
      FROM new_converts
      WHERE conversion_date <= NOW() - INTERVAL '42 days';
    `);

    // ✅ Clean up new_converts table
    await db.query(`
      DELETE FROM new_converts
      WHERE conversion_date <= NOW() - INTERVAL '42 days';
    `);

    console.log('[✔] New Converts upgraded and archived based on milestone requirements');
  } catch (err) {
    console.error('[❌] Error in updateNewConverts:', err.message, err.stack);
    throw err;
  }
};

module.exports = {
  populateFromMembers,
  updateFirstTimers,
  updateNewConverts
};
