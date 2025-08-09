const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("connecting to db...");

    mongoose.connection.on("connected", () => {
      console.log("Connected to database");
    });
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
