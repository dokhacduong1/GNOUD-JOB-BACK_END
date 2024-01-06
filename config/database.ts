import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/apply-for-job");
    console.log("Connect Success!");
  } catch (error) {
    console.log("Connect Error!");
  }
}