import mongoose from "mongoose";
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const jobSchema = new mongoose.Schema(
    {

        title: String,
        description: String,
        employerId: String,
        job_categorie_id: Array,
        website: String,
        level: String,
        jobType: String,
        salary: Number,
        age: Number,
        gender: String,
        educationalLevel: String,
        workExperience: Number,
        detailWorkExperience: String,
        welfare: Array,
        address: [
            {
                location: String,
                linkMap: Array,
            }
        ],
        phone: String,
        email: String,
        listUserId: Array,
        featured:Boolean,
        end_date:Date,
        start_date:Date,
        status: {
            type:String,
            default:"active"
        },
        deleted: {
            type: Boolean,
            default: false,
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


const Job = mongoose.model("Job", jobSchema, "jobs");

export default Job