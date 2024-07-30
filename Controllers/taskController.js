import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Task from "../Model/taskSchema.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine which environment file to load
const envPath =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

// Load the environment variables from the correct file
dotenv.config({ path: path.resolve(__dirname, envPath) });

dotenv.config();
const SECRET = process.env.JWT_SECRET;

// Function to extract token from request headers
const getTokenFrom = (req) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.substring(7); // Remove 'Bearer ' to get token
  }
  return null;
};

// Fetch tasks for a specific student
const fetchTask = async (req, res) => {
  try {
    console.log("Request received for fetchTask");
    const token = getTokenFrom(req);
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const decodedToken = jwt.verify(token, SECRET);
    console.log("Decoded Token:", decodedToken);

    if (!decodedToken.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const student = await Student.findById(decodedToken.id).populate("task");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Tasks fetched successfully:", student.task);
    res.status(200).json(student.task);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Fetch all tasks (optional)
const fetchAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Post a new task
const postTask = async (req, res) => {
  try {
    const {
      currentDay,
      frontEndCode,
      frontEndURL,
      backEndCode,
      backEndURL,
      task,
      title,
      check,
    } = req.body;
    console.log("Request body:", req.body); 

    const token = getTokenFrom(req);
    console.log("Extracted token:", token); 

    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout, please login again" });
    }

    const student = await Student.findById(decodedToken.id);

    const matchedTask = await Task.findOne({ check });
    if (matchedTask) {
      res.status(400).json({ message: "Task already submitted" });
      return;
    }

    const newTask = new Task({
      currentDay,
      frontEndCode,
      frontEndURL,
      backEndCode,
      backEndURL,
      task,
      title,
      check,
      student: student._id,
    });

    const savedTask = await newTask.save();

    student.task = student.task.concat(savedTask._id);
    await student.save();

    res.status(200).json({ message: "Task submitted successfully" });
  } catch (error) {
    console.error("Error during task submission:", error);
    return res
      .status(400)
      .json({ message: "Error on updating, please try again later" });
  }
};

// Update task score
const updateTaskScore = async (req, res) => {
  try {
    // Extract request body content
    const { id, score } = req.body;

    // Find task by ID to update score
    const matchedTask = await Task.findById(id);
    if (!matchedTask) {
      res.status(400).json({ message: "Task not found or already evaluated" });
      return;
    }

    // Update task score in collection
    matchedTask.score = score;
    await matchedTask.save();

    // Send response
    res.status(200).json({ message: "Task score updated successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error on updating, please try again later" });
  }
};

export { fetchTask, postTask, updateTaskScore, fetchAllTasks };
