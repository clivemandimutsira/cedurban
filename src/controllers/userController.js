// userController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await User.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    await User.assignRole(req.params.id, roleId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error assigning role' });
  }
};

exports.removeRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    await User.removeRole(req.params.id, roleId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error removing role' });
  }
};

// Reset temporary password
exports.resetTempPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const tempPassword = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(tempPassword, 10);

    await db.query(
      `UPDATE users SET password_hash = $1, temp_password = $2, password_reset_required = TRUE WHERE id = $3`,
      [hash, tempPassword, userId]
    );

    res.json({ tempPassword });
  } catch (e) {
    console.error('Error resetting password:', e);
    res.status(500).json({ message: 'Reset failed.' });
  }
};

// Unlock user account
exports.unlockUser = async (req, res) => {
  try {
    await db.query(
      `UPDATE users SET failed_login_attempts = 0, lockout_until = NULL WHERE id = $1`,
      [req.params.id]
    );
    res.status(204).end();
  } catch (e) {
    console.error('Unlock error:', e);
    res.status(500).json({ message: 'Unlock failed.' });
  }
};

// Toggle active status
exports.toggleActive = async (req, res) => {
  try {
    const { active } = req.body;
    await db.query(`UPDATE users SET is_active = $1 WHERE id = $2`, [active, req.params.id]);
    res.status(204).end();
  } catch (e) {
    console.error('Error toggling active status:', e);
    res.status(500).json({ message: 'Toggle active failed.' });
  }
};
