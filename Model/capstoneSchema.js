import mongoose from "mongoose";

// Define schema for capstone project
const capstoneSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Zen class student dashboard", // Default title if not provided
  },
  submittedOn: {
    type: Date,
    default: Date.now, // Default submission date to current date/time
  },
  comment: {
    type: String,
    default: "Waiting for review", // Initial comment
  },
  score: {
    type: String,
    default: "Waiting for review", // Initial score
  },
  status: {
    type: String,
    default: "submitted", // Initial status
  },
  feUrl: {
    type: String,
    required: [true, "FE URL is required"], // Frontend URL is required
  },
  beUrl: {
    type: String,
    required: [true, "BE URL is required"], // Backend URL is required
  },
  feCode: {
    type: String,
    required: [true, "FE Code URL is required"], // Frontend code URL is required
  },
  beCode: {
    type: String,
    required: [true, "BE Code URL is required"], // Backend code URL is required
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
  },
});

// Create and export the Capstone model
const Capstone = mongoose.model("Capstone", capstoneSchema, "capstones");

export default Capstone;

