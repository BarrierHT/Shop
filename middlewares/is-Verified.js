
exports.isVerified = (req, res, next) => {                                                  //Need to be unverified
    if(!req.session.isVerified)  return res.redirect('/confirmation');                                                   
    next();
}

exports.isNotVerified = (req, res, next) => {                                               //Need to be verified
    if(req.session.isVerified)  return res.redirect('/');                                                   
    next();
}