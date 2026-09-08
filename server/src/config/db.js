const mongoose = require("mongoose");
// Database ko connect karne ke liye function

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log("MongoDB connection Failed", error);
  }
};

module.exports = connectDB;
