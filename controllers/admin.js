const Product = require('../models/product');
const { validate } = require('../middlewares/validator');

exports.getAddProduct = (req,res,next) => {
    res.render('./admin/edit-product.ejs',{
        path: req._parsedOriginalUrl.pathname || req_parsedUrl.pathname,
        docTitle:'Add Products', 
        editing: false,
        oldInput: false,
        errorMessage: {}
    });
}

exports.postAddproduct = (req,res,next) => {
    const {title,price,description,imageUrl} = req.body; 
    
    const validationErrors = validate(req);

    if(Object.keys(validationErrors).length > 0){
        res.status(422).render('admin/edit-product.ejs',{
            path: req._parsedOriginalUrl.pathname || req_parsedUrl.pathname,
            docTitle: 'Add Products',
            editing: false,
            errorMessage: validationErrors,
            oldInput: true,
            userData: {title,price,description,imageUrl}
        })
    }
    else {
        let product = new Product({
                title:title,
                price:price,
                description:description,
                userId: req.user._id
            });
        
        if(product.userId == req.session.user._id){
            product
                .save()
                .then( result => res.redirect(301,'/admin/products') )
                .catch(err => {
                    console.log(err)
                    res.redirect(301,'/');  
                });
        } else res.redirect('/');
    }
};

exports.getProducts = (req,res) => {                                       
    if(req.user._id == req.session.user._id){
        Product.find({userId: req.user._id})
        // .select('name imageUrl price -_id')
            .populate('userId','name email')               //Joins, retrieve data from another collections
            .then(products => {
                // console.log('products: ',products);
                res.render('./admin/products.ejs',{
                    prods: products || [],
                    docTitle: 'All products',
                    path: req._parsedOriginalUrl.pathname
                }); 
            })
            .catch(err => {
                console.log(err);
            });		
    }
    else res.redirect('/');
}

exports.getEditProduct = (req,res) => {
    const editMode = req.query.edit === 'true'? true : false;
    if(!editMode) return res.redirect(301,'/');
    else{
        const validationErrors = validate(req);
        
        if(Object.keys(validationErrors).length > 0) return res.redirect('/');
        else{
            const {productId} = req.params;
                Product.findById(productId)
                .then(product => {
                    if(!product) return res.redirect(301,'/');
                    res.render('./admin/edit-product.ejs',{
                        docTitle:'Edit Products', 
                        path: '/admin/edit-product',                                      //? Main Path
                        editing: editMode,
                        product:product,
                        errorMessage: {}
                    })
                })
                .catch(err => console.log(err));
        }
    }
}

exports.postEditProducts = async (req,res) => {

    const {productId,title,price,description,imageUrl} = req.body;                         
    
    const validationErrors = validate(req);

    if(Object.keys(validationErrors).length > 0){
        res.status(422).render('./admin/edit-product.ejs',{
            docTitle:'Edit Products', 
            path: '/admin/edit-product',                                      //? Main Path
            editing: true,
            product:{_id: productId, title, price, description, imageUrl},
            errorMessage: validationErrors
        })
    }
    else {
        if(req.user._id == req.session.user._id){
           await Product.updateOne({_id: productId, userId:req.user._id},{ 
                $set: {
                    title, 
                    price,
                    description, 
                    imageUrl,
                    userId: req.user._id
                } }, 
                { upsert:true })
                    .then(result => res.redirect(301,'/admin/products'))
                    .catch( err => {
                        console.log(err);
                        res.redirect(301,'/');
                    });
        }
        else res.redirect('/');
    }
}

exports.postDeleteProducts = async (req,res) => {
    const {productId} = req.body
    if(req.user._id == req.session.user._id){
        await Product.deleteOne({_id: productId, userId:req.user._id})
                .then(result => res.redirect(301,'/admin/products'))
                .catch( err => {
                    console.log(err);
                    res.status(301).redirect('/');
                });
    }
    else res.redirect('/');
}

    
