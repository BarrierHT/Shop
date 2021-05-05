const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlockList = new Schema({

    type: {
        type:String,
        required:true
    },
    tokenValue: {
        type:String,
        required:true
    },
    expire_at:{
        type: Date, 
        default: Date.now(),
        expires:0                                                                               //Expire time (index in mongoDB)
    } 
});

module.exports = mongoose.model('BlockList-Token', BlockList);
