const mongoose = require("mongoose");

const mongoClient = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI, {
    await mongoose.connect("mongodb://localhost:27017/expense", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // dbName: process.env.DB_NAME,
    });
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Failed to connect to the database", err);
    throw err;
  }
};

module.exports = mongoClient;



