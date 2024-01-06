import mongoose from "mongoose";


const employerSchema = new mongoose.Schema(
    {
        title: String,
        email:String,
        password:String,
        token:String,
        phone:String,
        avatar:String,
        role_id:String,
        status:String,
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deleted: {
            type:Boolean,
            default: false
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
    },
    {
        timestamps:true
    }
);


const Admin = mongoose.model("Admin", employerSchema, "admins");

export default Admin