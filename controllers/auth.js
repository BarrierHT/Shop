const User = require('../models/user');

exports.getLogin = (req,res,next) => {

   let isLoggedIn = req.session.isLoggedIn;
    
    // try {
    //     isLoggedIn = req
    //     .get('Cookie')
    //     .split(';')[0]
    //     .trim()
    //     .split('=')[1] === 'true';
    // } catch (error) {
    //         console.log('error: ', error);
    // }

    console.log('isLoggedIn: ',req.session.isLoggedIn);

    res.render('auth/login.ejs', {
        path: req._parsedOriginalUrl.pathname,
        docTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    })
};

exports.postLogin = (req,res,next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; Max-age=60; HttpOnly; Path=/'); // Secure; 
    const email = req.body.email, password = req.body.password;
        User.findOne({email:email,password:password})
        .then(user => {
            if(user){
                req.session.user = user;                                                        //* Create a req.session.user in the middleware
                req.session.isLoggedIn = true;
                req.session.save( (err) => {
                    console.log('err:', error);
                    res.redirect('/');
                });
            }
            else return Promise.resolve(null);
         })
         .then(result => res.redirect('/'));
};

exports.postLogout = (req,res,next) => {
    req.session.destroy((error) => {
        console.log('error: ', error);
        res.redirect('/');
    });
};
