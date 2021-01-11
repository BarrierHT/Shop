const Product = require('../models/product');

exports.getIndex = (req,res) => {    
    Product.fetchTest()		        						//* Model ---> Views		
	.then(products => {
        // console.log('products: ',products);
        res.render('./shop/index.ejs',{
            prods: products || [], docTitle: 'Main Shop',
            path: req._parsedOriginalUrl.pathname
        }); 
	})
	.catch(err => console.log(err));
}

exports.getProducts = (req,res,next) => {      
    Product.fetchAll()										//* Model ---> Views		
	.then(products => {
        // console.log(products);
        res.render('./shop/product-list.ejs',{
            prods: products || [], docTitle: 'All products',
            path: req._parsedOriginalUrl.pathname
        }); 
	})
	.catch(err => console.log(err));
}

exports.getProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then( product  => {
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
    Product.findById(prodId)
        .then(product => req.user.addToCart(product) )
        .then(result => {
            // console.log('result: ',result);
            res.redirect(301,'/cart');
        })
        .catch(err => console.log(err));
}

exports.getCart = (req,res) => {
    req.user.getCartProducts()
        .then(products =>{
            let totalPrice = 0;
            // console.log('products: ',products);
            for (const product of products) totalPrice+= (product.quantity*product.price);
            
            res.render('./shop/cart.ejs',{
                docTitle: `Cart Shop ${req.user._id}`, 
                path:req._parsedOriginalUrl.pathname,
                products: products,
                totalPrice: totalPrice
            });  
        })
        .catch(err => console.log(err));
}

exports.postDeleteCart = (req,res) => {
    const prodId = req.body.cartProductId;

    req.user.deleteCartItem(prodId)
        .then(result => {
            // console.log(result);
            res.redirect(301,'/cart');
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req,res) => {

    req.user
        .addOrder()
        .then(result => {
            // console.log(result);
            res.redirect(301,'/orders');
        })
        .catch(err => console.log(err));


    // let fetchedCart;
    // req.user
    //     .createOrder()
    //     .then(order => {
    //         req.user
    //             .getCart()
    //             .then(cart => {
    //                 fetchedCart = cart;
    //                 return cart.getProducts();
    //             })
    //             .then(products => {
    //                 return products.forEach(product => {
    //                     order.addProduct(product, {through:{quantity:product.cartItem.quantity}} );
    //                 });
    //             })
    //             .then(result => fetchedCart.setProducts(null))
    //             .then(result => res.redirect(301,'/orders'))
    //             .catch(err => console.log(err));
    //     })
    //     .catch(err => console.log(err));
}

exports.getOrders = (req,res) => {

    req.user.getOrders()
        .then(orders => {

            orders.forEach(order => {
                let totalPrice = 0;
                order.items.forEach( product => totalPrice+= (product.quantity*product.price) )
                order.totalPrice = totalPrice;
            });
            
            console.log('orders: ',orders);

            res.render('./shop/orders.ejs',{
                docTitle: 'Orders', 
                path:req._parsedOriginalUrl.pathname,
                orders: orders   
            }); 
        })
        .catch(err => console.log(err));

    // req.user
    //     .getOrders({include: [{
    //         model: Product, 
    //         required:false,
    //         where:{}
    //      }]})
    //     .then(orders => {
    //         // console.log(orders[0].products[0].orderItem);
    //         res.render('./shop/orders.ejs',{
    //             docTitle: 'Orders', 
    //             path:req._parsedOriginalUrl.pathname,
    //             orders: orders              
    //         }); 
    //     })
    //     .catch(err => console.log(err));
}


exports.getCheckout = (req,res) => {
    res.render('./shop/checkout.ejs',{
        docTitle: 'Checkout', 
        path:req._parsedOriginalUrl.pathname});   
}
