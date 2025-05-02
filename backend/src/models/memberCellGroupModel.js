// src/models/memberCellGroupModel.js

const db = require('../config/db');

// Create Cell Group Membership
exports.createMembership = async (data) => {
  const { member_id, cell_group_id, designation, date_joined } = data;
  const result = await db.query(`
    INSERT INTO member_cell_group (member_id, cell_group_id, designation, date_joined)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [member_id, cell_group_id, designation, date_joined]);
  return result.rows[0];
};

// Get All
exports.getAllMemberships = async () => {
  const result = await db.query('SELECT * FROM member_cell_group ORDER BY id DESC');
  return result.rows;
};

// Get By ID
exports.getMembershipById = async (id) => {
  const result = await db.query('SELECT * FROM member_cell_group WHERE id = $1', [id]);
  return result.rows[0];
};


exports.updateMembership = async (id, data) => {
  const { designation, date_joined } = data;

  console.log('🔧 Running SQL UPDATE with:', { id, designation, date_joined });

  const result = await db.query(`
    UPDATE member_cell_group
    SET designation = $1,
        date_joined = $2
    WHERE id = $3
    RETURNING *;
  `, [designation, date_joined, id]);

  return result.rows[0];
};


// Delete
exports.deleteMembership = async (id) => {
  const result = await db.query('DELETE FROM member_cell_group WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

exports.getMembershipsByCellGroupId = async (cellGroupId) => {
  const result = await db.query(`
    SELECT 
      mcg.id,
      mcg.member_id,
      mcg.cell_group_id,
      mcg.designation,
      mcg.date_joined,
      m.first_name,
      m.surname,
      m.email,
      m.contact_primary
    FROM member_cell_group mcg
    LEFT JOIN members m ON mcg.member_id = m.id
    WHERE mcg.cell_group_id = $1
    ORDER BY mcg.id DESC;
  `, [cellGroupId]);
  return result.rows;
};


exports.getMembershipsByMemberId = async (memberId) => {
  const result = await db.query(
    `SELECT * FROM member_cell_group WHERE member_id = $1 ORDER BY id DESC`,
    [memberId]
  );
  return result.rows;
};
