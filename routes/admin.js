const express = require('express');

const  userValidationRules  = require('../middlewares/validator').userValidationRules;

const isAuth = require('../middlewares/is-Auth').isAuth;
const isVerified = require('../middlewares/is-Verified').isVerified;

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', isAuth, isVerified, adminController.getProducts);

router.get('/add-product', isAuth, isVerified, adminController.getAddProduct);

router.post('/add-product', isAuth, isVerified, userValidationRules('body--title','body--price','body--description','body--imageUrl'), adminController.postAddproduct);

router.post('/delete-product', isAuth, isVerified, adminController.postDeleteProducts);

router.post('/edit-product', isAuth, isVerified, userValidationRules('body--title','body--price','body--description','body--imageUrl'), adminController.postEditProducts);

router.get('/edit-product/:productId', isAuth, isVerified,userValidationRules('param--objectId_productId'), adminController.getEditProduct);


exports.router = router;