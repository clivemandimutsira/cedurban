// server/routes/contributionRoutes.js
const express = require('express');
const ctrl    = require('../controllers/contributionController');
const router  = express.Router();

router.get('/member/:id', ctrl.getByMember);
router.post('/:id/proof', ctrl.uploadProof);
router.post('/pay', ctrl.makePayment);


module.exports = router;
