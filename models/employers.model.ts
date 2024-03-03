import mongoose from "mongoose";


const employerSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        companyName: String,
        fullName: String,
        numberOfWorkers: Number,
        contactPersonName: String,
        phoneNumber: String,
        level: String,
        address: 
            {
                city: String,
                district: String,
              
            }
        ,
        image : String,
        token : String,
        listApprovedUsers : Array,
        gender: String,
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