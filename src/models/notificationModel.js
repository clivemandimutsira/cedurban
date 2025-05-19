const db = require('../config/db');

module.exports = {
  async getByMemberId(memberId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { rows } = await db.query(
      `SELECT * FROM notifications WHERE member_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [memberId, limit, offset]
    );
    return rows;
  },

  async countByMemberId(memberId) {
    const { rows } = await db.query(
      `SELECT COUNT(*) AS total FROM notifications WHERE member_id = $1`,
      [memberId]
    );
    return Number(rows[0].total);
  },

  async markAsRead(id) {
    return db.query(`UPDATE notifications SET is_read = true WHERE id = $1`, [id]);
  },

  async markAllAsRead(memberId) {
    return db.query(`UPDATE notifications SET is_read = true WHERE member_id = $1`, [memberId]);
  },

  async create(payload) {
    const fields = [
      'member_id','group_id','department_id','member_type','is_global',
      'title','message','type','via_email','via_sms','scheduled_at','recurrence'
    ];
    const values = fields.map(f => payload[f] ?? null);
    const placeholders = fields.map((_, i) => `$${i+1}`).join(',');

    const { rows } = await db.query(
      `INSERT INTO notifications (${fields.join(',')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return rows[0];
  },

  async getById(id) {
    const { rows } = await db.query('SELECT * FROM members WHERE id = $1', [id]);
    return rows[0] || null;
  }
};