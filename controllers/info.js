exports.get404 = (req,res,next) =>{
    console.log('Page not found, 404 error');
    res.status(404).render('404.ejs',{
        docTitle:'404 Page Not Found',
        path: '404'
    });
}

exports.firstMiddleware = (req,res,next) => {               
    // console.log(req);                            
    console.log('This is always running');
    console.log('url:' , req._parsedUrl.pathname);    

    next();                                                             
}