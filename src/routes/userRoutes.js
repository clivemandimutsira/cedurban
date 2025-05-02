const router = require('express').Router();
const userCtrl = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.get('/', authenticate, checkPermission('view_users'), userCtrl.getAllUsers);
router.get('/:id', authenticate, checkPermission('view_users'), userCtrl.getUserById);
router.put('/:id', authenticate, checkPermission('manage_users'), userCtrl.updateUser);
router.delete('/:id', authenticate, checkPermission('manage_users'), userCtrl.deleteUser);

router.post('/:id/roles', authenticate, checkPermission('manage_users'), userCtrl.assignRole);
router.delete('/:id/roles', authenticate, checkPermission('manage_users'), userCtrl.removeRole);

module.exports = router;
