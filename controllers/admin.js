const Product = require('../models/product');

exports.getAddProduct = (req,res,next) => {
    res.render('./admin/edit-product.ejs',{
        docTitle:'Add Products', 
        path: req._parsedOriginalUrl.pathname || req_parsedUrl.pathname,
        editing: false
    });              
}

exports.postAddproduct = (req,res,next) => {

    const {title,price,description,imageUrl} = req.body;                        //? logic before save a new data

    req.user
        .createProduct({                                                        //* Views -> Model
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description
        })
	    .then( result => res.redirect(301,'/admin/products') )
	    .catch(err => {
            console.log(err)
            res.redirect(301,'/');
        });

};


exports.getEditProduct = (req,res) => {
    const editMode = req.query.edit === 'true'? true : false;
    if(!editMode) res.redirect(301,'/');
    else{
        const prodId = req.params.productId;

        req.user
            .getProducts( {where: {id:prodId} } )
            .then(products => {
                let product = products[0];

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


    Product.findByPk(productId)
    .then(product => {

        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;
        
        return product.save();
    })

    .then(result => res.redirect(301,'/admin/products'))
    .catch( err => {
        console.log(err);
        res.redirect(301,'/');
    });
   
}

exports.postDeleteProducts = (req,res) => {

    console.log('prodId: ',req.body.productId);
    Product.findByPk(req.body.productId)
    .then(product => product.destroy())

    .then(result => res.redirect(301,'/admin/products'))
    .catch( err => {
        console.log(err);
        res.redirect(301,'/');
    });

}

exports.getProducts = (req,res) => {                                       
    req.user
        .getProducts()                              //* Model ---> Views
        .then(products => {
            // console.log('products: ',products);
            res.render('./admin/products.ejs',{
            prods: products || [], docTitle: 'All products',
                path: req._parsedOriginalUrl.pathname
            }); 
        })
        .catch(err => console.log(err));								  

}

    
