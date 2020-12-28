const Product = require('../models/product');

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Op = Sequelize.Op;

exports.getIndex = (req,res) => {
    Product.findAll()										//* Model ---> Views		
	.then(products => {

        res.render('./shop/index.ejs',{
            prods: products || [], docTitle: 'Main Shop',
            path: req._parsedOriginalUrl.pathname
        }); 
	})
	.catch(err => console.log(err));
}

exports.getProducts = (req,res,next) => {      

    Product.findAll()										//* Model ---> Views		
	.then(products => {

        res.render('./shop/product-list.ejs',{
            prods: products || [], docTitle: 'All products',
            path: req._parsedOriginalUrl.pathname
        }); 
	})
	.catch(err => console.log(err));
}

exports.getProduct = (req,res,next) => {
    const productId = req.params.productId;

    Product.findAll({
        attributes:['id','title','description','price','imageUrl'],       
        where: {
            id: productId
        }, 
    })
    .then( products  => {
        let product = products[0];

        // console.log('product: ',product);
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

exports.postCart = (req,res) => {
    const prodId = req.body.id;
    // console.log(req.user);
    req.user
        .getCart()
        .then(cart => {
            cart.getProducts( {where: { id:prodId } })
                .then(products => {
                    let product = null;
                    if(products.length > 0) product = products[0];
                    let newQuantity = 1;                                            //* get Old Quantity or define new Quantity
                    // console.log('product: ',product);
                    if(product){
                        newQuantity = product.cartItem.quantity + 1;
                        product.cartItem.quantity = newQuantity;
                        return product.cartItem.save();
                    }
                    return Product.findByPk(prodId)
                           .then(product => cart.addProduct( product,{ through:{ quantity:newQuantity } } ) ) 
                           .catch(err => console.log(err)); 
                })
                .then(result => res.redirect(301,'/cart') )
                .catch(err => console.log(err));  
            })
        .catch(err => console.log(err));
}

exports.getCart = (req,res) => {
    req.user
        .getCart()
        .then(cart => {
            cart.getProducts()
                .then(products => {
                    let totalPrice = 0;
                    for (const product of products) totalPrice+= (product.price * product.cartItem.quantity);
                    // console.log('products: ', products);
                    res.render('./shop/cart.ejs',{
                        docTitle: `Cart Shop ${req.user.id}`, 
                        path:req._parsedOriginalUrl.pathname,
                        products: products,
                        totalPrice: totalPrice
                    });   
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

exports.postDeleteCart = (req,res) => {
    const prodId = req.body.cartProductId;
    req.user
        .getCart()
        .then(cart => {
            cart.getProducts( {where: { id:prodId } })
                .then(products => {
                    let product = null;
                    if(products.length > 0) product = products[0];
                    if(product){
                        let quantity = product.cartItem.quantity;
                        if(quantity > 1){
                            product.cartItem.quantity--;
                            return product.cartItem.save();
                        } 
                        return product.cartItem.destroy();  
                    } 
                    return Promise.resolve(product);
                })
                .then(result => res.redirect(301,'/cart') )
                .catch(err => console.log(err));  
            })
        .catch(err => console.log(err));
}

exports.postOrder = (req,res) => {
    let fetchedCart;
    req.user
        .createOrder()
        .then(order => {
            req.user
                .getCart()
                .then(cart => {
                    fetchedCart = cart;
                    return cart.getProducts();
                })
                .then(products => {
                    return products.forEach(product => {
                        order.addProduct(product, {through:{quantity:product.cartItem.quantity}} );
                    });
                })
                .then(result => fetchedCart.setProducts(null))
                .then(result => res.redirect(301,'/orders'))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req,res) => {

    req.user
        .getOrders({include: [{
            model: Product, 
            required:false,
            where:{}
         }]})
        .then(orders => {
            // console.log(orders[0].products[0].orderItem);
            res.render('./shop/orders.ejs',{
                docTitle: 'Orders', 
                path:req._parsedOriginalUrl.pathname,
                orders: orders              
            }); 
        })
        .catch(err => console.log(err));
}


exports.getCheckout = (req,res) => {
    res.render('./shop/checkout.ejs',{
        docTitle: 'Checkout', 
        path:req._parsedOriginalUrl.pathname});   
}