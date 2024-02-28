import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    dateOfBirth: Date,
    address: String,
    workAddress: Array,
    phone: String,
    educationalLevel: String,
    schoolName: String,
    foreignLanguage: String,
    yearsOfExperience: String,
    companyName: String,
    desiredSalary: String,
    jobTitle: String,
    avatar:{
      type: String,
      default: "https://lh3.googleusercontent.com/d/1ILtAxkD9TrKMtGQkxX9eThmrMjCp49W0"
    },
    skill_id: Array,
    job_categorie_id: String,
    job_position: Array,
    gender: Number,
    image: String,
    token: String,
    emailSuggestions:Array,
    activeJobSearch: {
      type: Boolean,
      default: false,
    },
    allowSearch: {
      type: Boolean,
      default: true,
    },
    
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");

export default User;
