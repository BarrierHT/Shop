const Product = require('../models/product');
const Order = require('../models/orders');
const product = require('../models/product');

exports.getIndex = (req,res) => {    
   
    Product.aggregate([ 
        { $project: { "price":1, "title":1 , "_id":1 } },
        { $limit: 4 },
        { $skip: 0 },
        { $sort: {price: 1, title: -1} },
        { $group :
            {
            _id : "_$id",
            totalSaleAmount: { $sum: { $multiply: [ "$price", 2 ] } },
            count: { $sum: 1 }
            }
        },
        { $match: { "totalSaleAmount": { $gte: 10 } } } ])
        .then(products => {
            // console.log('products: ',products);
            res.render('./shop/index.ejs',{
                prods: products || [], 
                docTitle: 'Main Shop',
                path: req._parsedOriginalUrl.pathname
            }); 
        })
    .catch(err => console.log(err));
    
}

exports.getProducts = (req,res,next) => {      
    Product.find(/*{title: /a/,price:{$lte:129}} */ )									//* Model ---> Views		
	.then(products => {
        // console.log(products);
        res.render('./shop/product-list.ejs',{
            prods: products || [],
            docTitle: 'All products',
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
            path:'/products'
        });
    })
    .catch(err => console.log(err));

}

exports.postCart = (req,res) => {
    const prodId = req.body.id;

    req.user
        .addToCart(prodId)
        .then(result => {
            // console.log('result: ',result);
            res.redirect(301,'/cart');
        })
        .catch(err => console.log(err));
}

exports.getCart = (req,res) => {
        req.user
            .populate('cart.items.productId', '-imageUrl')
            .execPopulate()
            .then(cartUser =>{
                let products = cartUser.cart.items;            
                let totalPrice = 0;
    
                products = products.map(product => {
                    totalPrice+= (product.quantity*product.productId.price);
                    return {
                        quantity: product.quantity,
                        price: product.productId.price,
                        title: product.productId.title,
                        _id: product.productId._id
                    };
                })  
                // console.log('products: ',products);
                res.render('./shop/cart.ejs',{
                        docTitle: `Cart Shop - ${req.user.name}`, 
                        path:req._parsedOriginalUrl.pathname,
                        products: products,
                        totalPrice: totalPrice
                    });  
            })
            .catch(err => console.log(err));
    
}

exports.postDeleteCart = (req,res) => {
    const prodId = req.body.cartProductId;

    return req.user
        .deleteCartItem(prodId)
        .then(result => {
            // console.log(result);
            return res.redirect(301,'/cart');
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
}

exports.getOrders = (req,res) => {
        Order.find({'user._id': req.user._id})
        .then(orders => {

            // console.log('orders: ',orders);
            
            orders.forEach(order => {
                let totalPrice = 0;
                order.items.forEach( product => totalPrice+= (product.quantity*product.price) )
                order.totalPrice = totalPrice;
            });
            
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
        path:req._parsedOriginalUrl.pathname, 
    });   
}
