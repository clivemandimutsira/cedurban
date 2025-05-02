// backend/src/controllers/notificationController.js

const Notification = require('../models/Notification');

exports.getAllNotifications = async (req, res) => {
  try {
    const data = await Notification.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.getNotificationsByMember = async (req, res) => {
  try {
    const data = await Notification.getByMemberId(req.params.memberId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch member notifications' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const data = await Notification.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    const data = await Notification.markAsSeen(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const data = await Notification.delete(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};
