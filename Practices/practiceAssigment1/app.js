const http = require('http');

const routesMain = require('./main.js');

console.log(routesMain.text);
const server = http.createServer(routesMain.handler);

server.listen(3000);