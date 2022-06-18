const router = require('express').Router();
const { getUsers, getUserById, postUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', postUser);

module.exports = router;
