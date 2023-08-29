const router = require('express').Router();
const { getUserData, updateUser } = require('../controllers/users');

router.get('/me', getUserData);

router.patch('/me', updateUser);

module.exports = router;
