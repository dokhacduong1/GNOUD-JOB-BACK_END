import mongoose from "mongoose";

const employerCounterSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const EmployerCounter = mongoose.model("EmployerCounter", employerCounterSchema, "employer-counter");

export default EmployerCounter;
