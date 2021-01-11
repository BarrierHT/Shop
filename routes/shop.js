const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);                         //Dynamic Route

router.get('/cart', shopController.getCart);

router.post('/add-to-cart', shopController.postCart);

router.post('/delete-cart-item', shopController.postDeleteCart);


router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);


router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);


exports.router = router;
