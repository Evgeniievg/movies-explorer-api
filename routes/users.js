const router = require('express').Router();
const { getUserData, updateUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validation');

router.get('/me', getUserData);

router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
