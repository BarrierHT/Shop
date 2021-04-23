const path = require('path');

const express = require('express');


const isAuth = require('../middlewares/is-Auth').isAuth;
const isNotAuth = require('../middlewares/is-Auth').isNotAuth;

const authController = require('../controllers/auth');

const router = express.Router();


router.get('/login', isNotAuth, authController.getLogin);

router.get('/signup', isNotAuth, authController.getSignUp);

router.post('/login', isNotAuth, authController.postLogin);

router.post('/signup', isNotAuth, authController.postSignUp);

router.post('/logout', isAuth, authController.postLogout);

exports.router = router;