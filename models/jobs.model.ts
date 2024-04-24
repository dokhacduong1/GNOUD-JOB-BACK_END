import mongoose from "mongoose";
var slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const jobSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    employerId: String,
    job_categorie_id: Array,
    website: String,
    level: String,
    jobType: Array,
    salaryMin: Number,
    salaryMax: Number,
    ageMin: Number,
    ageMax: Number,
    gender: String,
    educationalLevel: String,
    workExperience: String,
    detailWorkExperience: String,
    linkVideoAboutIntroducingJob: String,
    welfare: Array,
    presentationLanguage: Array,
    phone: String,
    email: String,
    listTagName: Array,
    listTagSlug: Array,
    receiveEmail: String,
    featured: Boolean,
    end_date: Date,
    deletedAt: Date,
    yearsOfExperience:String,
    city: {
      slug: String,
      code: Number,
      name: String,
    },
    countOpenCv:{
      type: Number,
      default: 0
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
     listProfileRequirement: [
   
    //     email: String,
    //     phone: String,
    //     id_file_cv: String,
    //     introducing_letter: String,
    //     status: String,
    //     dateTime: Date,
    //     idUser: String,
    //     countView: Number,
    
    ],
    listProfileViewJob: {
      type: Array,
      default: [],
    },
    address: {
      location: String,
      linkMap: Array,
    },
    status: {
      type: String,
      default: "pending",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    keyword: {
      type: String,
      slug: "title",
      unique: true,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema, "jobs");

export default Job;
