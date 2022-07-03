const router = require('express').Router();
const {
  getUsers, getUserById, patchProfile, patchAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', patchProfile);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
