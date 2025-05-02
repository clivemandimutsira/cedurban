const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const res = await db.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email`,
      [email, passwordHash]
    );
    return res.rows[0];
  }

  static async getAll() {
    const res = await db.query(`
      SELECT 
        u.id, 
        u.email, 
        COALESCE(
          json_agg(
            json_build_object('id', r.id, 'name', r.name)
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      GROUP BY u.id
      ORDER BY u.id
    `);
    return res.rows;
  }

  static async getById(id) {
    const res = await db.query(`
      SELECT 
        u.id, 
        u.email, 
        COALESCE(
          json_agg(
            json_build_object('id', r.id, 'name', r.name)
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.id = $1
      GROUP BY u.id
    `, [id]);
    return res.rows[0];
  }

  static async getByEmail(email) {
    const res = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return res.rows[0];
  }

  static async update(id, { email, password }) {
    let query = `UPDATE users SET `;
    const params = [];
    let idx = 1;

    if (email) {
      query += `email = $${idx++}`;
      params.push(email);
    }
    if (password) {
      if (params.length) query += ', ';
      const hash = await bcrypt.hash(password, 10);
      query += `password_hash = $${idx++}`;
      params.push(hash);
    }
    query += ` WHERE id = $${idx} RETURNING id, email`;
    params.push(id);

    const res = await db.query(query, params);
    return res.rows[0];
  }

  static async delete(id) {
    await db.query(`DELETE FROM users WHERE id = $1`, [id]);
  }

  static async assignRole(userId, roleId) {
    await db.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, roleId]
    );
  }

  static async removeRole(userId, roleId) {
    await db.query(
      `DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2`,
      [userId, roleId]
    );
  }

  static async getRoles(userId) {
    const res = await db.query(
      `SELECT r.name FROM roles r 
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = $1`,
      [userId]
    );
    return res.rows.map(role => role.name);
  }

  static async getPermissions(userId) {
    const res = await db.query(
      `SELECT p.name FROM permissions p
       JOIN role_permissions rp ON rp.permission_id = p.id
       JOIN roles r ON rp.role_id = r.id
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = $1`,
      [userId]
    );
    return res.rows.map(permission => permission.name);
  }
}

module.exports = UserModel;
