const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/janawaj";

    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    // Only add SSL options for Atlas URIs (mongodb+srv://)
    if (mongoUri.startsWith("mongodb+srv://")) {
      options.tls = true;
      options.tlsAllowInvalidCertificates = true;
    }

    const conn = await mongoose.connect(mongoUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn(
      "⚠️  Server will continue running without database connection",
    );
    console.warn("   Some features may not work until database is connected.");
    // Don't exit - let the server start so health check works
    return null;
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected!");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected!");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB error: ${err.message}`);
});

module.exports = connectDB;
