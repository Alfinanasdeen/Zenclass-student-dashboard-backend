import mongoose from "mongoose";

// Define schema for tasks
const taskSchema = new mongoose.Schema({
  currentDay: {
    type: String,
    required: [true, "Task Day is required"],
    // Day of the task
  },
  frontEndCode: {
    type: String,
    // Frontend code associated with the task
  },
  frontEndURL: {
    type: String,
    // Frontend URL associated with the task
  },
  backEndCode: {
    type: String,
    // Backend code associated with the task
  },
  backEndURL: {
    type: String,
    // Backend URL associated with the task
  },
  score: {
    type: String,
    default: "Yet to be graded",
    // Score status of the task
  },
  task: {
    type: String,
    // Task number or identifier
  },
  title: {
    type: String,
    // Title of the task
  },
  submittedOn: {
    type: Date,
    default: Date.now,
    // Date when the task was submitted
  },
  check: {
    type: String,
    unique: true,
    // Check status or identifier
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    // Reference to the student associated with the task
  },
});

// Create and export the Task model
const Task = mongoose.model("Task", taskSchema)

export default Task;