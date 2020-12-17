const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getAddProduct = (req,res,next) => {
    res.render('./admin/edit-product.ejs',{
        docTitle:'Add Products', 
        path: req._parsedOriginalUrl.pathname || req_parsedUrl.pathname,
        editing: false
    });              
}



exports.postAddproduct = (req,res,next) => {
                                                                                    //? logic before save a new data
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product(null,title,price, description, imageUrl);               //Creating a new object
    product.save()
    .then( ([rows,fieldData]) => {
        res.redirect(301,'/products');
    })
    .catch (error => console.log(err));     
}

exports.getEditProduct = (req,res) => {
    const editMode = req.query.edit === 'true'? true : false;
    if(!editMode) res.redirect(301,'/');
    else{
        const prodId = req.params.productId;
        Product.findById( prodId, product => {
            if(!product) return res.redirect(301,'/');
            res.render('./admin/edit-product.ejs',{
                docTitle:'Edit Products', 
                path: '/admin/edit-product',                                      //? Main Path
                editing: editMode,
                product:product
            });  
        });
    }
}

exports.postEditProducts = (req,res) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;

    const updatedProduct = new Product(prodId,updatedTitle,updatedPrice,updatedDescription,updatedImageUrl);

    updatedProduct.save(()=>{

        Product.fetchAll(products => {
            Cart.getCart(cart => {
                let totalPrice = 0;
                for(product of products){
                    const cartProductData = cart.products.find( prodCart => prodCart.id == product.id);
                    if(cartProductData) {
                        const productPriceTotal = (cartProductData.qty*product.price);
                        totalPrice+=productPriceTotal;
                    }
                }
                Cart.updateTotalPrice(totalPrice, () => res.redirect(301,'/admin/products') );
            });
        });
    });
}

exports.postDeleteProducts = (req,res) => {
    console.log('prodId: ',req.body.productId);
    Product.deleteById(req.body.productId, () => {
        res.redirect(301,'/admin/products');    
    });
}

exports.getProducts = (req,res) => {
    Product.fetchAll(products => {                                                  //* Model ---> Views
        res.render('./admin/products.ejs',{
        prods: products || [], docTitle: 'All products',
            path: req._parsedOriginalUrl.pathname
        }); 
    });
}


