const path = require('path');

const express = require('express');

const isAuth = require('../middlewares/is-Auth').isAuth;
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, adminController.postAddproduct);

router.post('/delete-product', isAuth, adminController.postDeleteProducts);

router.post('/edit-product', isAuth, adminController.postEditProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);


exports.router = router;