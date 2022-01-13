const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    companyname: {
      type: String,
      required: true,
    },
    websitelink: {
      type: String,
      default:""
    },
    foundedDate: {
      type: Date,
      default:""
    },
    organizationType: {
      type: String,
      default:""
    },
    country: {
      type: String,
      default:""
    },
    contactNumber: {
      type: Number,
      required:true
    },
    description: {
      type: String,
      default:""
    },
    email: {
      type: String,
      required:true
    },
    state: {
      type: String,
      default:""
    },
    city:{
      type: String,
      default:""
    },
    address: {
      type: String,
      default:""
    },
    pincode: {
      type: Number,
      default:""
    },
    facebook:{
      type: String,
      default:""
    },
    twitter:{
      type: String,
      default:""
    },
    google:{
      type: String,
      default:""
    },
    linkedin:{
      type: String,
      default:""
    }
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("RecruiterInfo", schema);
