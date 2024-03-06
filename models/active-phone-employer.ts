import mongoose from "mongoose";


const activePhoneEmployerSchema = new mongoose.Schema(
    {
        email: String,
        msg_id: String,
        session: String,
        phone: String,
        timeWait:Date,
        expireAt: {
            type: Date,
        }
    }
);
activePhoneEmployerSchema.index({ "lastModifiedDate": 1 }, { expireAfterSeconds: 11 });

const ActivePhoneEmployer = mongoose.model("ActivePhoneEmployerSchema", activePhoneEmployerSchema, "active-phone-eployer");

export default ActivePhoneEmployer