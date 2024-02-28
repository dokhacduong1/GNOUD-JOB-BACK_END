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

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

export default ForgotPassword