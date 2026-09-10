import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Call this once from server.js before starting the Express app.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};