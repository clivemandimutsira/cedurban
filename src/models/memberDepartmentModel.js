// src/models/memberDepartmentModel.js

const db = require('../config/db');

exports.createAssignment = async (data) => {
  const { member_id, department_id, designation, date_joined } = data;
  const result = await db.query(`
    INSERT INTO member_department (member_id, department_id, designation, date_joined)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [member_id, department_id, designation, date_joined]);
  return result.rows[0];
};

exports.getAllAssignments = async () => {
  const result = await db.query('SELECT * FROM member_department ORDER BY id DESC');
  return result.rows;
};

exports.getAssignmentById = async (id) => {
  const result = await db.query('SELECT * FROM member_department WHERE id = $1', [id]);
  return result.rows[0];
};

exports.updateAssignment = async (id, data) => {
  const { designation, date_joined } = data;
  const result = await db.query(`
    UPDATE member_department
    SET designation = $1, date_joined = $2
    WHERE id = $3
    RETURNING *;
  `, [designation, date_joined, id]);
  return result.rows[0];
};

exports.deleteAssignment = async (id) => {
  const result = await db.query('DELETE FROM member_department WHERE id = $1 RETURNING *;', [id]);
  return result.rows[0];
};
