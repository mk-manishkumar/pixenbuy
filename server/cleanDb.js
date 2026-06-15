import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const cleanDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // We use the model directly if possible, or just raw collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");
    
    // Find the admin
    const admin = await usersCollection.findOne({ role: "admin" });
    if (admin) {
      console.log("Found existing admin:", admin);
      await usersCollection.deleteOne({ _id: admin._id });
      console.log("Deleted old admin account successfully.");
    } else {
      console.log("No admin found in the database.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

cleanDb();
