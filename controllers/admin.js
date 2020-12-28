const Product = require('../models/product');

exports.getAddProduct = (req,res,next) => {
    res.render('./admin/edit-product.ejs',{
        docTitle:'Add Products', 
        path: req._parsedOriginalUrl.pathname || req_parsedUrl.pathname,
        editing: false
    });              
}

exports.postAddproduct = (req,res,next) => {
    const {title,price,description,imageUrl} = req.body;                        
    const product = new Product(null,title,price,imageUrl,description);
    
    product
        .save()
	    .then( result => res.redirect(301,'/admin/products') )
	    .catch(err => {
            console.log(err)
            res.redirect(301,'/');  
        });

};

exports.getProducts = (req,res) => {                                       
    Product.fetchAll()
    .then(products => {
        // console.log('products: ',products);
        res.render('./admin/products.ejs',{
        prods: products || [], docTitle: 'All products',
            path: req._parsedOriginalUrl.pathname
        }); 
    })
    .catch(err => console.log(err));								  
}

exports.getEditProduct = (req,res) => {
    const editMode = req.query.edit === 'true'? true : false;
    if(!editMode) res.redirect(301,'/');
    else{
        const prodId = req.params.productId;
            Product.findById(prodId)
            .then(product => {
                // console.log('product: ',product);
                if(!product) return res.redirect(301,'/');
                res.render('./admin/edit-product.ejs',{
                    docTitle:'Edit Products', 
                    path: '/admin/edit-product',                                      //? Main Path
                    editing: editMode,
                    product:product
                })
            })
            .catch(err => console.log(err));
    }
}

exports.postEditProducts = (req,res) => {

    const {productId,title,price,description,imageUrl} = req.body;                        

    const product = new Product(productId,title,price,imageUrl,description); 

    product.save()
    .then(result => res.redirect(301,'/admin/products'))
    .catch( err => {
        console.log(err);
        res.redirect(301,'/');
    });
}

exports.postDeleteProducts = (req,res) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
    .then(result => res.redirect(301,'/admin/products'))
    .catch( err => {
        console.log(err);
        res.redirect(301,'/');
    });
}

    
