
// === routes/rulesRoutes.js ===
const express = require('express');
const router = express.Router();
const controller = require('../controllers/rulesController'); // Replace with correct controller name

// Example placeholder route
router.get('/', controller.getAllRules); // Implement controller

module.exports = router;
