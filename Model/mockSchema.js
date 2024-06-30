import mongoose from "mongoose";

// Define schema for mock interview
const mockSchema = new mongoose.Schema({
  interviewDate: {
    type: Date,
    // Example: "2024-06-23"
  },
  interviewerName: {
    type: String,
    // Example: "John Doe"
  },
  interviewRound: {
    type: String,
    // Example: "Technical Round 1"
  },
  attended: {
    type: String,
    default: "Yes",
    // Whether student attended or not
  },
  comment: {
    type: String,
    // Optional comments on the interview
  },
  logicalScore: {
    type: Number,
    // Numeric score for logical skills assessment
  },
  overallScore: {
    type: Number,
    // Overall assessment score
  },
  recordingURL: {
    type: String,
    default: "https://www.google.com/",
    // Default URL for interview recording
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
  },
});

// Create and export the Mock model
const Mock = mongoose.model("Mock", mockSchema, "mocks");

export default Mock;

