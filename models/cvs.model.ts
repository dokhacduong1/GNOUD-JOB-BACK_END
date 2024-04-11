import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    email: String,
    fulName: String,
    phone: String,
    id_file_cv: Array,
    introducing_letter: String,
    dateTime: Date,
    idUser: String,
    status:String,
    countView:{
        type:Number,
        default:0
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Cv = mongoose.model("Cv", cvSchema, "cvs");

export default Cv;
