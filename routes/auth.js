const path = require('path');

const express = require('express');


const isAuth = require('../middlewares/is-Auth').isAuth;
const isNotAuth = require('../middlewares/is-Auth').isNotAuth;

const isNotVerified = require('../middlewares/is-Verified').isNotVerified;

const authController = require('../controllers/auth');

const router = express.Router();


router.get('/login', isNotAuth, authController.getLogin);

router.get('/signup', isNotAuth, authController.getSignUp);

router.get('/confirmation',isAuth, isNotVerified, authController.getConfirmation);

router.post('/confirmation',isAuth, isNotVerified, authController.postEmailToken);

router.get('/confirmation/:token', authController.getEmailToken);

router.post('/login', isNotAuth, authController.postLogin);

router.post('/signup', isNotAuth, authController.postSignUp);

router.post('/logout', isAuth, authController.postLogout);

exports.router = router;