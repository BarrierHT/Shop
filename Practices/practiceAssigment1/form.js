const handlerForm = (req,res) => {

    const url = req.url, method = req.method;

    if ( url == '/' ){
        res.setHeader('Content-Type','text/html');
        res.write('<html> <form action="./create-user" method="POST"> <input type="text" name="userName" placeholder="Digite el nombre"> <button type="submit" > Submit </button> </form> </html> ');
        return res.end();
    } 
 
};

module.exports = {
    handler:handlerForm
};