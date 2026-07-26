const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/janawaj";
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
