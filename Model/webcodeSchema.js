import mongoose from "mongoose";

// Define schema for webcodes
const webcodeSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Make up API",
    // Title of the webcode
  },
  submittedOn: {
    type: Date,
    default: Date.now,
    // Date when the webcode was submitted
  },
  comment: {
    type: String,
    default: "Waiting for review",
    // Comment or feedback on the webcode's status
  },
  score: {
    type: String,
    default: "Waiting for review",
    // Score status of the webcode
  },
  status: {
    type: String,
    default: "pending",
    // Status of the webcode (e.g., pending, approved)
  },
  feUrl: {
    type: String,
    required: [true, "FE URL is required"],
    // Frontend URL associated with the webcode
  },
  feCode: {
    type: String,
    required: [true, "FE Code URL is required"],
    // Frontend code URL associated with the webcode
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    // Reference to the student associated with the webcode
  },
});

// Create and export the Webcode model
const Webcode = mongoose.model("Webcode", webcodeSchema, "webcodes");

export default Webcode;
