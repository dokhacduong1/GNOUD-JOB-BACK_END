import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
  try {
    console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect Success!");
  } catch (error) {
    console.log("Connect Error!");
  }
}