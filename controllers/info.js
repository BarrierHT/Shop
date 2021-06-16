exports.get404 = (req,res,next) =>{
    console.log('Page not found, 404 error');
    res.status(404).render('404.ejs',{
        docTitle:'404 Page Not Found',
        path: '404',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.firstMiddleware = async (req,res,next) => {            
    // const cryptoRandomString = await import('crypto-random-string');
    // console.log( 'crypto: ', cryptoRandomString.default({length:64, type:'base64'}) ); 
    
    // console.log(req);                            
    // console.log('This is always running');
    console.log('Current method: ', req.method);
    console.log('current Url:' , req._parsedUrl.pathname);          //req._parsedOriginalUrl.pathname
    // console.log('current User: ', req.user);

    next();                                                             
}