import mongoose from "mongoose";

// Define schema for query
const querySchema = new mongoose.Schema({
  queryTitle: {
    type: String,
    required: [true, "Query title is required"],
    // Title of the query
  },
  queryDesc: {
    type: String,
    required: [true, "Query description is required"],
    // Description of the query
  },
  appliedOn: {
    type: Date,
    default: Date.now,
    // Date when the query was applied
  },
  status: {
    type: String,
    default: "Not assigned",
    // Status of the query (Not assigned, Assigned, Resolved, etc.)
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
  },
});

// Create and export the Query model
const Query = mongoose.model("Query", querySchema, "queries");

export default Query;

