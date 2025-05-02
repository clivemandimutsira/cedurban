const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/memberCellGroupController');

// Order matters: more specific routes must come before generic `/:id`
router.get('/by-group/:cellGroupId', ctrl.getMembershipsByCellGroupId);
router.get('/by-member/:memberId', ctrl.getMembershipsByMemberId);
router.get('/:id', ctrl.getMembershipById); // generic /:id should be last

router.post('/', ctrl.createMembership);
router.get('/', ctrl.getAllMemberships);
router.put('/:id', ctrl.updateMembership);
router.delete('/:id', ctrl.deleteMembership);

module.exports = router;
