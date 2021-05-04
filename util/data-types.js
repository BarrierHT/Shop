const mongoose = require('mongoose');

exports.objectIdValid = (id) => mongoose.Types.ObjectId.isValid(id);