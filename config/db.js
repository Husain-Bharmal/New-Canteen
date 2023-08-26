const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://cmskjsit:ansahuis2023@canteen.pq6ynuz.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected ...");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
