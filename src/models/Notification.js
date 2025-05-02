// backend/src/models/Notification.js

const db = require('../config/db');

const Notification = {
  async getAll() {
    const { rows } = await db.query('SELECT * FROM notifications ORDER BY created_at DESC');
    return rows;
  },

  async getByMemberId(memberId) {
    const { rows } = await db.query('SELECT * FROM notifications WHERE member_id = $1 ORDER BY created_at DESC', [memberId]);
    return rows;
  },

  async create(data) {
    const { member_id, title, message, type, scheduled_at } = data;
    const { rows } = await db.query(
      `INSERT INTO notifications (member_id, title, message, type, scheduled_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [member_id, title, message, type || 'info', scheduled_at || new Date()]
    );
    return rows[0];
  },

  async markAsSeen(id) {
    const { rows } = await db.query(
      'UPDATE notifications SET seen = true WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await db.query('DELETE FROM notifications WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

module.exports = Notification;
