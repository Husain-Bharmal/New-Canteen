const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
    enum: ["COMPUTER","IT", "EXTC", "AIDS" ]
  },
  role:{
    type:String,
    enum:["student", "teacher", "admin"],
    required: true
  },  
  isAdmin: {
    type: Boolean,
  },
  otp:{
    type:Number,
  },
  otpTimestamp:{
  type: Date,
  }
});

module.exports = mongoose.model('user', UserSchema);
