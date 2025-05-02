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