const router = require('express').Router();

const { login, createUser, signout } = require('../controllers/users');
const { signupValidation } = require('../middlewares/signupValidation');
const { signinValidation } = require('../middlewares/signinValidation');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../utils/not-found-error');

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.post('/signup', signupValidation, createUser);
router.post('/signin', signinValidation, login);
router.post('/signout', auth, signout);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
