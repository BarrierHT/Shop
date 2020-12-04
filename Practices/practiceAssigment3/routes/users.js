const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

router = express.Router();

router.get('/users' ,(req,res) => {
    res.status(301).sendFile(path.join(rootDir,'views','users.html'));
});

module.exports = {
    router: router
};

