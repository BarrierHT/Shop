const handlerUsers = (req,res) => {

    const url = req.url, method = req.method;

    if(url == '/users'){
        res.setHeader('Content-Type','text/html');
        res.write('<html> <body> <ul> <li> User1 </li>  <li> User2 </li> <li> User3 </li> <li> User4 </li> </ul> </html> </body>');
        return res.end(); 
    }

};

module.exports = {
    handler:handlerUsers
};