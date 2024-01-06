import mongoose from "mongoose";
var slug = require('mongoose-slug-updater');

const jobCategoriesSchema = new mongoose.Schema(
    {
        title : String,
        parent_id:String,
        position:Number,
        thumbnail:String,
        description:String,
        deletedAt:Date,
        deleted: {
            type: Boolean,
            default: false,
        },
        status: {
            type:String,
            default:"active"
        },
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        keyword: {
            type: String,
            slug: "title",
            unique: true
        },
        
    }
    ,
    {
        timestamps: true
    }
);


const JobCategories = mongoose.model("JobCategories", jobCategoriesSchema, "jobs-categories");

export default JobCategories