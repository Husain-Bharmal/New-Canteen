const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeedBack = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
    enum: ["COMPUTER","IT", "EXTC", "AIDS" ]
  },
  description:{
    type:String,
    required:true,
  }
});

module.exports = mongoose.model('feedback', FeedBack);