const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("MONGO_URI is not set. Running with demo data only.");
    return false;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn(`MongoDB unavailable: ${error.message}`);
    console.warn("Continuing with read-only demo data.");
    return false;
  }
};

module.exports = connectDB;
