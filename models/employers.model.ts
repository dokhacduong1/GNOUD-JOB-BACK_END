import mongoose from "mongoose";


const employerSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        companyName: String,
        numberOfWorkers: Number,
        contactPersonName: String,
        phoneNumber: String,
        address: String,
        image : String,
        token : String,
        listApprovedUsers : Array,
        status: {
            type:String,
            default:"active"
        },
        cvRecruitment: [
            {
                userId: String,
                infoCv: String
            }

        ],
        deleted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deletedBy: {
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [
            {
                account_id: String,
                updatedAt: Date
            }
        ],
    }
    ,
    {
        timestamps: true
    }
);


const Employer = mongoose.model("Employer", employerSchema, "employers");

export default Employer