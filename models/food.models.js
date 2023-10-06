const mongoose = require('mongoose');
const FoodItemSchema = new mongoose.Schema({
  foodType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required:false
  },
  quantity:{
    type:Number,
    required:true
  },
  totalItemSold:{
    type:Number,
  },
  totalEarnings:{
    type:Number,
  }

});

module.exports = mongoose.model('food', FoodItemSchema);
