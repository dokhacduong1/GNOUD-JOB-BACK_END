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
        code: String,
        level: String,
        activePhone:{
            type:Boolean,
            default:false
        },
        address: 
            {
                city: String,
                district: String,
              
            }
        ,
        image : {
            type: String,
            default: "https://lh3.googleusercontent.com/d/1ILtAxkD9TrKMtGQkxX9eThmrMjCp49W0"
        },
        token : String,
        listApprovedUsers : Array,
        gender: String,

        status: {
            type:String,
            default:"active"
        },
        cointsGP : {
            type:Number,
            default:0
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