const express = require('express');

const  userValidationRules  = require('../middlewares/validator').userValidationRules;

const isAuth = require('../middlewares/is-Auth').isAuth;
const isVerified = require('../middlewares/is-Verified').isVerified;

const shopController = require('../controllers/shop');

const router = express.Router();


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', userValidationRules('param--objectId_productId'),shopController.getProduct);                         //Dynamic Route

router.get('/cart', isAuth, isVerified, shopController.getCart);

router.post('/add-to-cart', isAuth, isVerified, shopController.postCart);

router.post('/delete-cart-item', isAuth, isVerified, shopController.postDeleteCart);

router.post('/create-order', isAuth, isVerified, shopController.postOrder);

router.get('/orders', isAuth, isVerified, shopController.getOrders);

router.get('/checkout', isAuth, isVerified, shopController.getCheckout);


exports.router = router;
