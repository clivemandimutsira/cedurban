const db = require('../config/db');

exports.create = async (data) => {
  const { member_id, counselor_id, session_date, mode, status, notes } = data;
  const res = await db.query(
    `INSERT INTO counseling_sessions (member_id, counselor_id, session_date, mode, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *;`,
    [member_id, counselor_id, session_date, mode, status || 'scheduled', notes]
  );
  return res.rows[0];
};

exports.getAll = async () => {
  const res = await db.query(`SELECT * FROM counseling_sessions ORDER BY session_date DESC`);
  return res.rows;
};

exports.getById = async (id) => {
  const res = await db.query(`SELECT * FROM counseling_sessions WHERE id = $1`, [id]);
  return res.rows[0];
};

exports.update = async (id, data) => {
  const { session_date, mode, status, notes } = data;
  const res = await db.query(
    `UPDATE counseling_sessions
     SET session_date = $1, mode = $2, status = $3, notes = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING *;`,
    [session_date, mode, status, notes, id]
  );
  return res.rows[0];
};

exports.delete = async (id) => {
  const res = await db.query(`DELETE FROM counseling_sessions WHERE id = $1 RETURNING *;`, [id]);
  return res.rows[0];
};
