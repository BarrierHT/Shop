const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', adminController.getProducts);

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddproduct);

router.post('/delete-product', adminController.postDeleteProducts);

router.post('/edit-product', adminController.postEditProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.get('/',(req,res,next) => {                                        
    console.log(req.baseUrl);
    res.send('<h1> You are in admin page </h1> ');                      //Sending a response (last Middleware) with auto Content-Type
}); 


exports.router = router;