//const secret = require('random-bytes').sync(64).toString('hex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require("lodash");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const BlockListToken = require('../models/blocklist-token');
const User = require('../models/user');
const differenceTimeStamp = require('../util/timestamp');
const objectIdValid = require('../util/data-types').objectIdValid;

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: process.env.API_KEY
    }
}));

exports.getEmailToken = async (req,res,next) => {
    const emailToken = req.params.token;

    try {
        let { user: { _id }, creationDate } = jwt.verify(emailToken, process.env.SECRET_EMAIL);

        await BlockListToken.findOne({ type:'email_verification', tokenValue:emailToken })
                .then(async (blockListRecord) => {
                    if(blockListRecord) return res.status(401).send('Token was used already');                      //Invalid Token
                    else{
                        creationDate = new Date(creationDate);
                        let expireDate = new Date(creationDate.setHours(creationDate.getHours() + 1));
                        expireDate = expireDate.setMinutes(expireDate.getMinutes() + 5);

                        await User.updateOne( {_id:_id}, { $set: { verified: true } } );
                        await BlockListToken.insertMany([{type:'email_verification', tokenValue:emailToken, expire_at:expireDate}]);
                        req.session.isVerified = true;
                        return res.redirect('/');
                    }
                })
                .catch(err => console.log(err));

    } catch (err) {
        console.log(err);
        return res.status(403).send('Token not found');
    }
    
}

const postEmailToken = async (req,res,next) => {

    const difference = differenceTimeStamp.getDifference( new Date(), new Date(req.session.lastEmailToken) );
    // console.log('difference: ', difference);

    if(difference.minutesDifference >= 5){
        req.session.lastEmailToken = new Date();
        jwt.sign(
            { user: _.pick(req.session.user,'_id'), creationDate: new Date() },
            process.env.SECRET_EMAIL,
            { expiresIn: '1h' },
            (err, emailToken) => {
                const url = `http://localhost:3000/confirmation/${emailToken}`;
                console.log('error(emailToken): ', err);
    
                transporter.sendMail({
                    to: req.session.user.email,
                    from: process.env.EMAIL_USER,
                    subject:'Confirm Email',
                    html: `<div style="overflow:auto; padding:15px;"> Please click this link to verify your email <mark>(This link has 1 hour to be used)</mark>: <a target="_blank" href="${url}">${url}</a> </div>`,
                });
            }
        );
    }
    else await req.flash('errorEmailToken','An e-mail was sent already, wait 5 minutes to send another verification email');

    return res.redirect('/confirmation');
};

exports.postEmailToken = postEmailToken;

exports.getLogin = (req,res,next) => {

    let errorMessage =  req.flash('errorLogin');
    errorMessage = errorMessage.length > 0 ? errorMessage[0] : null; 

    res.render('auth/login.ejs', {
        path: req._parsedOriginalUrl.pathname,
        docTitle: 'Login',
        errorMessage
    })
};

exports.postLogin = (req,res,next) => {
    const {email, password} = req.body;
    
    User.findOne({email})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password)
            .then(doMatch => {
                if(doMatch){
                    req.session.user = user;                                                           //* Create a req.session.user in the middleware
                    req.session.isLoggedIn = true;
                    req.session.isVerified = user.verified;
                    req.session.lastEmailToken =  !(user.verified)? new Date(1262304000000) : null ;   //Old Timestamp

                    req.session.save( (error) => {
                        console.log('error(session):', error);
                        return res.redirect('/confirmation');
                    });
                }
                else{
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
                req.flash('errorLogin','Invalid email or password.');
                return res.redirect('/login');
            }
         })
         .catch(err => console.log('error: ' , err) );
};

exports.getSignUp = (req,res,next) => {

    let errorMessage =  req.flash('errorSignUp');
    errorMessage = errorMessage.length > 0 ? errorMessage[0] : null; 

    res.render('auth/signup.ejs', {
        docTitle: 'Sign up',
        path: req._parsedOriginalUrl.pathname,
        errorMessage
    })
};

exports.postSignUp = async (req,res,next) => {
    const {email,password,confirmPassword,name} = req.body;
    let userCreated;

    await User.findOne({email})
            .then(user => {
                if(user){
                    req.flash('errorSignUp','Email is taken already.');
                    return null;
                }
                else return bcrypt.hash(password,12);                                          //*Encrypt Password
            })
            .then( hashedPassword => {
                if(hashedPassword){
                        const user = new User({
                            email,
                            password: hashedPassword,
                            name,
                            verified:false,
                            cart: { items:[] },
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
                        req.session.isVerified = false;
                        req.session.lastEmailToken =  new Date(1262304000000);                                 //Old Timestamp

                        req.session.save( (error) => {
                            console.log('error(session-login):', error);
                                return postEmailToken(req,res,next);
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

exports.getConfirmation = (req,res,next) => {
    let errorMessage = req.flash('errorEmailToken');
    errorMessage = errorMessage.length > 0 ? errorMessage[0] : null; 

    res.render('auth/confirmation',{
        docTitle:'Confirm Page',
        path: req._parsedOriginalUrl,
        errorMessage
    })
}

exports.getReset = (req,res,next) => {
    let errorMessage = req.flash('errorEmailReset');
    errorMessage = errorMessage.length > 0 ? errorMessage[0] : null; 

    res.render('auth/reset-password',{
        docTitle : 'Reset Password',
        path: req._parsedOriginalUrl,
        errorMessage:  errorMessage
    })
}

exports.postReset = async(req,res,next) => {
    const email = req.body.email;  
    await User.findOne({email})
        .then(user => {
            if(!user){
                req.flash('errorEmailReset','Email is not signed up');
            }
            else{
                jwt.sign( 
                    {user: _.pick(user,'_id'), creationDate : new Date()},
                    process.env.SECRET_RESET_PASSWORD,
                    {expiresIn: '1h'},
                        (err,emailToken) => {
                            const url = `http://localhost:3000/reset-password/${emailToken}`;
                            console.log('error(emailToken): ', err);
                
                            transporter.sendMail({
                                to: email,
                                from: process.env.EMAIL_USER,
                                subject:'Reset Password',
                                html: `<div style="overflow:auto; padding:15px;"> Please click this link to confirm you want to reset your password <mark>(This link has 1 hour to be used)</mark>: <a target="_blank" href="${url}">${url}</a> </div>`,
                            });
                        } 
                );
            }
        })
        .catch(err => console.log(err));
    
    return res.redirect('/reset-password');
}

exports.getResetToken = async (req,res,next) => {
    const resetToken = req.params.resetToken;

    try {
        let { user: { _id }, creationDate } = jwt.verify(resetToken, process.env.SECRET_RESET_PASSWORD);
        
        await BlockListToken.findOne({ type:'password_reset', tokenValue:resetToken })
            .then(async (blockListRecord) => {
                if(blockListRecord) return res.status(401).send('Token was used already');                      //Invalid Token
                else{
                    creationDate = new Date(creationDate);
                    let expireDate = new Date(creationDate.setHours(creationDate.getHours() + 1));
                    expireDate = expireDate.setMinutes(expireDate.getMinutes() + 5);

                    await BlockListToken.insertMany([{type:'password_reset', tokenValue:resetToken, expire_at:expireDate}]);
                    res.render('auth/new-password',{
                        docTitle: 'Update Password',
                        path: req._parsedOriginalUrl,
                        userId: _id ?? 'UserNotFound',
                        errorMessage
                    })
                }
        })
        .catch(err => console.log(err));

    } catch (err) {
        console.log(err);
        return res.status(403).send('Token not found');
    }
    
}

exports.postNewPassword = async(req,res,next) => {
    let {userId, password, confirmPassword} = req.body;
    let updatedUser;

    if(!objectIdValid(userId)) userId = 'UserNotFound';

        await User.findOne({_id:userId})
        .then(user => {
            if(user){
                updatedUser = user;
                return bcrypt.hash(password,12);
            } 
            else return null;
        })
        .then(async (hashedPassword) => {
            if(hashedPassword){
                updatedUser.password = hashedPassword;
                await updatedUser.save();
            }
            res.redirect('/login');
        })
        .catch(err => console.log(err));

}