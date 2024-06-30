import mongoose from "mongoose";

// Define schema for portfolio
const portfolioSchema = new mongoose.Schema({
  portfolioURL: {
    type: String,
    required: [true, "Portfolio URL is required"],
    // URL where portfolio is hosted
  },
  githubURL: {
    type: String,
    required: [true, "GitHub URL is required"],
    // GitHub repository URL
  },
  resumeURL: {
    type: String,
    required: [true, "Resume URL is required"],
    // URL where resume is hosted
  },
  reviewedBy: {
    type: String,
    default: "Not yet reviewed",
    // Name or role of the person who reviewed the portfolio
  },
  status: {
    type: String,
    default: "Submitted",
    // Current status of the portfolio (Submitted, In Review, Approved, etc.)
  },
  comment: {
    type: String,
    default: "Not yet reviewed",
    // Feedback or comments given during the review process
  },
  submittedOn: {
    type: Date,
    default: Date.now,
    // Date when the portfolio was submitted
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
  },
});

// Create and export the Portfolio model
const Portfolio = mongoose.model("Portfolio", portfolioSchema, "portfolios");

export default Portfolio;

