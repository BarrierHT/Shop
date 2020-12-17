const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req,res) => {
    Product.fetchAll()                            
    .then(([products]) => {
        res.render('./shop/index.ejs',{
            prods: products || [], docTitle: 'Main Shop',
            path: req._parsedOriginalUrl.pathname
        }); 
    })                                        
    .catch( err => console.log(err));  
}

exports.getProducts = (req,res,next) => {      
    Product.fetchAll()                               //* Model ---> Views
    .then(([products]) => {
        res.render('./shop/product-list.ejs',{
            prods: products || [], docTitle: 'All products',
            path: req._parsedOriginalUrl.pathname
        }); 
    })                                        
    .catch( err => console.log(err));    
}

exports.getProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then( ([rows]) => {
        let product = rows[0];
        try{
            product.imageUrl = product.imageUrl;                            //?Problem with img Url request (too long)
        }catch(err){
            product = {};
        };
        res.render('./shop/product-detail.ejs',{
        docTitle: `Product: ${product.title}`,
        product: product, 
        path:'/products'});
    })
    .catch(err => console.log(err));
}

exports.getCheckout = (req,res) => {
    res.render('./shop/checkout.ejs',{
        docTitle: 'Checkout', 
        path:req._parsedOriginalUrl.pathname});   
}

exports.postCart = (req,res) => {
    const prodId = req.body.id;
    Product.findById(prodId, prod => {
        Cart.addProduct(prod.id,prod.price);
        // console.log(req.headers.referer);
        res.redirect(301,'/cart');
    });
}

exports.getCart = (req,res) => {
    Cart.getCart( cart => {
        const cartProducts = [];
        Product.fetchAll(products => {
            for(product of products){
                const cartProductData = cart.products.find( prodCart => prodCart.id == product.id);
                if(cartProductData) {
                    cartProducts.push({...product,qty:cartProductData.qty});
                }
            }
            // console.log('productsCart: ',cartProducts);
            res.render('./shop/cart.ejs',{
                docTitle: 'Cart Shop', 
                path:req._parsedOriginalUrl.pathname,
                products: cartProducts,
                totalPrice: cart.totalPrice
            });   
        });        
    });
}

exports.postDeleteCart = (req,res) => {
    const prodId = req.body.cartProductId;
    Product.findById(prodId,product => {
        const priceProduct = product.price;
        Cart.deleteProductById(prodId,priceProduct,false,  () => {
            res.redirect(301,'/cart');
        });
    })
}

exports.getOrders = (req,res) => {
    res.render('./shop/orders.ejs',{
        docTitle: 'Orders', 
        path:req._parsedOriginalUrl.pathname});   
}
