let text = 'Hello user from NodeJS!';

const routesUsers = require('./users.js');
const routesCreateUser = require('./create-user.js');
const routesCreateForm = require('./form.js');

const handlerMain = (req,res) => {
    const url = req.url, method = req.method;
    console.log(url,method);


    routesCreateForm.handler(req,res);                  //Main Form

    routesUsers.handler(req,res);                       //Users Menu

    routesCreateUser.handler(req,res);                  //Create and show user (Receive data by POST)

};


module.exports = {
    handler:handlerMain,
    text:text
};
