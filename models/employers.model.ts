import mongoose from "mongoose";

var slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const employerSchema = new mongoose.Schema(
    {
        //Đoạn này là chứa thông tin tài khoản
        email: String,
        password: String,
        fullName: String,
        contactPersonName: String,
        phoneNumber: String,
        code: String,
        level: String,
        token : String,
        listApprovedUsers : Array,
        gender: String,
        //ĐOạn này là chứa thông tin công ty
        companyName: String,
        emailCompany:String,
        addressCompany: String,
        descriptionCompany: String,
        phoneCompany: String,
        website: String,
        numberOfWorkers: String,
        taxCodeCompany: String,
        specificAddressCompany: String,
        bannerCompany:{
            type: String,
            default: "https://res.cloudinary.com/dmmz10szo/image/upload/v1713900525/GNOUD_n4xqix.png"
        },
        slug: {
            type: String,
            slug: "companyName",
            unique: true,
          },
        activityFieldList:{
            type: Array,
            default: []
        },
        statusOnline: {
            type: Boolean,
            default: false,
          },
        logoCompany: {
            type: String,
            default: "https://res.cloudinary.com/dmmz10szo/image/upload/v1710149283/GNOUD_2_pxldrg.png"
        },
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
        position: {
            type: Number,
            default: 1
        },
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