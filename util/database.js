<<<<<<< HEAD
const mongodb = require('mongodb');
const env = require('dotenv').config();
const MongoClient = mongodb.MongoClient;

let _db;

let mongoUser = 'administrator';
let mongoPassword = 'VaxS1iEjJcawdinl';
let mongoDatabase = 'Node-course';
// console.log(process.env);

const mongoConnect = callback => { 
    MongoClient.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@node-course.msdnf.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client =>{
        // console.log('Connected: ',client);
        console.log('Connection with MongoDB was succesfull !');
        _db = client.db(mongoDatabase);
        callback();
    })
    .catch(err =>{
        console.log('error: ',err);
        throw err;  
    });
}

const getDb = () =>{
    if(_db) return _db;
    throw 'No database found';
}

exports.checkConnection = mongoConnect;
exports.getDb = getDb;
=======
const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('node-complete','root','administrator',{
    dialect: 'mysql',
    host: 'localhost'
})
>>>>>>> 2938fcc... SQL(Sequelize) Module finished

module.exports = sequelize;
