import mongoose from "mongoose";

// Define schema for leave application
const leaveSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: [true, "Reason for leave is required"],
  },
  appliedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Waiting for Approval",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
  },
});

// Create and export the Leave model
const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;

