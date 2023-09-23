const router = require('express').Router();

const { login, createUser, signout } = require('../controllers/users');
const { signupValidation, signinValidation } = require('../middlewares/validation');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../utils/not-found-error');
const { PAGE_NOT_FOUND } = require('../utils/messages');

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.post('/signup', signupValidation, createUser);
router.post('/signin', signinValidation, login);
router.post('/signout', auth, signout);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError(PAGE_NOT_FOUND));
});

module.exports = router;
