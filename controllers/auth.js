const bcrypt = require('bcryptjs');
const user = require('../models/user');

const User = require('../models/user');

exports.getLogin = (req,res,next) => {

   let isLoggedIn = req.session.isLoggedIn;
   
   let errorMessage =  req.flash('errorLogin');
   
   if(errorMessage) errorMessage = errorMessage[0];
   else errorMessage = null;

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
        errorMessage
    })
};

exports.postLogin = (req,res,next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; Max-age=60; HttpOnly; Path=/'); // Secure; 
    const {email, password} = req.body;
    
    User.findOne({email})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password)
            .then(doMatch => {
                if(doMatch){
                    req.session.user = user;                                                        //* Create a req.session.user in the middleware
                    req.session.isLoggedIn = true;
                    req.session.save( (error) => {
                        console.log('error(session):', error);
                        return res.redirect('/');
                    });
                }
                else{
                    console.log('Password not matched');
                    req.flash('errorLogin','Invalid email or password.');
                    return  res.redirect('/login');
                }
            })
            .catch( err => {
                console.log('error: ' , err);
                res.redirect('/');
            } );
            }
            else{
                console.log('email not matched');
                req.flash('errorLogin','Invalid email or password.');
                return res.redirect('/login');
            }
         })
         .catch(err => console.log('error: ' , err) );
};

exports.getSignUp = (req,res,next) => {

    let errorMessage =  req.flash('errorSignUp');
    if(errorMessage) errorMessage = errorMessage[0];
    else errorMessage = null;

    res.render('auth/signup.ejs', {
        docTitle: 'Sign up',
        path: req._parsedOriginalUrl.pathname,
        errorMessage
    })
};

exports.postSignUp = (req,res,next) => {
    const {email,password,confirmPassword,name} = req.body;
    let userCreated;

    User.findOne({email})
        .then(user => {
            if(user){
                console.log('Email taken');
                req.flash('errorSignUp','Email is taken already.');
                return null;
            }
            else return bcrypt.hash(password,12);                                          //*Encrypt Password
        })
        .then( hashedPassword => {
            // console.log('hashedPassword: ' , hashedPassword);
            if(hashedPassword){
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name,
                        cart: { items:[] }
                    });
                    userCreated = user;
                return user.save();
            }
            else return null;
        })
        .then( (user) =>{
            if(user){
                console.log('User created');
                    req.session.user = userCreated;                                                        //* Create a req.session.user in the middleware
                    req.session.isLoggedIn = true;
                    req.session.save( (error) => {
                        console.log('error(session-login):', error);
                        return res.redirect('/');
                    });
            }
            else return res.redirect('/signup');
        })
        .catch(error => console.log('error: ' , error));

};

exports.postLogout = (req,res,next) => {
    req.session.destroy((error) => {
        console.log('error: ', error);
        res.redirect('/');
    });
};
