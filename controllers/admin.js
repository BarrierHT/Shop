const Product = require('../models/product');

exports.getAddProduct = (req,res,next) => {
    res.render('./admin/edit-product.ejs',{
        docTitle:'Add Products', 
        path: req._parsedOriginalUrl.pathname || req_parsedUrl.pathname,
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });              
}

exports.postAddproduct = (req,res,next) => {
    const {title,price,description,imageUrl} = req.body;    
    let product;
    try {
        product = new Product({
            title:title,
            price:price,
            description:description,
            userId: req.user._id
        });
    } catch (error) {
        return res.redirect('/');
    }

    imageUrl.length > 0 ? product.imageUrl = imageUrl : product.imageUrl;

    product
        .save()
	    .then( result => res.redirect(301,'/admin/products') )
	    .catch(err => {
            console.log(err)
            res.redirect(301,'/');  
        });

};

exports.getProducts = (req,res) => {                                       
    // const cond = {
    //     userId: ObjectId(req.user._id)
    // };
    try {
        Product.find({userId: req.user._id})
        // .select('name imageUrl price -_id')
            .populate('userId','name email')               //Joins, retrieve data from another collections
            .then(products => {
                // console.log('products: ',products);
                res.render('./admin/products.ejs',{
                    prods: products || [],
                    docTitle: 'All products',
                    path: req._parsedOriginalUrl.pathname,
                    isAuthenticated: req.session.isLoggedIn
                }); 
            })
            .catch(err => {
                console.log(err);
            });		
    } catch (error) {
        res.redirect('/');
    }
    
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
                    product:product,
                    isAuthenticated: req.session.isLoggedIn
                })
            })
            .catch(err => console.log(err));
    }
}

exports.postEditProducts = (req,res) => {

    const {productId,title,price,description,imageUrl} = req.body;                         

    const obj = {
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl,
        userId: req.user._id
    }

    // Product.findByIdAndUpdate(productId,{
    //     title: title, 
    //     price: price, 
    //     description: description, 
    //     imageUrl: imageUrl
    // })
    // Product.findById(productId)
        //.then(product => {
        //     product.title = title;
        //     product.price = price;
        //     product.description = description;  
        //     product.imageUrl = imageUrl;
        //     return product.save();
        // })
    Product.updateOne({_id: productId},{ $set: obj },{ upsert:true })
    .then(result => res.redirect(301,'/admin/products'))
    .catch( err => {
        console.log(err);
        res.redirect(301,'/');
    });
}

exports.postDeleteProducts = (req,res) => {
    const prodId = req.body.productId;
    Product.deleteOne({_id: prodId})
    .then(result => res.redirect(301,'/admin/products'))
    .catch( err => {
        console.log(err);
        res.redirect(301,'/');
    });
}

    
