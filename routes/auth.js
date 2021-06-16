const express = require('express');

const  userValidationRules  = require('../middlewares/validator').userValidationRules;

const isAuth = require('../middlewares/is-Auth').isAuth;
const isNotAuth = require('../middlewares/is-Auth').isNotAuth;

const isNotVerified = require('../middlewares/is-Verified').isNotVerified;

const authController = require('../controllers/auth');

const router = express.Router();


router.get('/login', isNotAuth, authController.getLogin);

router.get('/signup', isNotAuth, authController.getSignUp);

router.get('/confirmation', isAuth, isNotVerified, authController.getConfirmation);

router.get('/reset-password', isNotAuth, authController.getReset);

router.post('/reset-password', isNotAuth, userValidationRules('body--email'),authController.postReset);

router.get('/reset-password/:resetToken', isNotAuth, authController.getResetToken);

router.post('/new-password', isNotAuth, userValidationRules('body--password','body--confirmPassword') , authController.postNewPassword);

router.post('/confirmation', isAuth, isNotVerified, authController.postEmailToken);

router.get('/confirmation/:token', authController.getEmailToken);

router.post('/login', isNotAuth, userValidationRules('body--email','body--password') ,authController.postLogin);

router.post('/signup', isNotAuth, userValidationRules('body--email','body--name','body--password','body--confirmPassword'), authController.postSignUp);

router.post('/logout', isAuth, authController.postLogout);

exports.router = router;
