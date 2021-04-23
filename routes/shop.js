const path = require('path');

const express = require('express');

const isAuth = require('../middlewares/is-Auth').isAuth;
const shopController = require('../controllers/shop');

const router = express.Router();


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);                         //Dynamic Route

router.get('/cart', isAuth, shopController.getCart);

router.post('/add-to-cart', isAuth, shopController.postCart);

router.post('/delete-cart-item', isAuth, shopController.postDeleteCart);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/checkout', isAuth, shopController.getCheckout);


exports.router = router;
