const path = require('path');

const express = require('express');

const rootDir = require('./util/path');
const usersRoutes = require('./routes/users');
const mainRoutes = require('./routes/index');

const app = express();

app.use( express.static(path.join(rootDir,'public')) );

app.use(usersRoutes.router);

app.use(mainRoutes.router);


app.listen(3000);