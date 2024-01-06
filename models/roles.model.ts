import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        keyword: {
            type: String,
            slug: "title",
            unique: true
        },
        permissions: {
            type: Array,
            default: []
        },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deleted: {
            type: Boolean,
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
        timestamps: true
    }
);


const Role = mongoose.model("Role", roleSchema, "roles");

export default Role