import mongoose from "mongoose";


const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        tokenReset: String,
        timeWait:Date,
        expireAt: {
            type: Date,
        }
    }
);
forgotPasswordSchema.index({ "lastModifiedDate": 1 }, { expireAfterSeconds: 11 });

const ForgotPasswordEmployer = mongoose.model("ForgotPasswordEmployer", forgotPasswordSchema, "forgot-password-employer");

export default ForgotPasswordEmployer