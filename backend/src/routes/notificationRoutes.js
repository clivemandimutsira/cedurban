// backend/src/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');

router.get('/', controller.getAllNotifications);
router.get('/:memberId', controller.getNotificationsByMember);
router.post('/', controller.createNotification);
router.put('/:id/seen', controller.markAsSeen);
router.delete('/:id', controller.deleteNotification);

module.exports = router;
