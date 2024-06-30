import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Task from "../Model/taskSchema.js";

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
    const token = getTokenFrom(req);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const student = await Student.findById(decodedToken.id).populate('task');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.task);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
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
    // Extract request body content
    const {
      day,
      frontEndCode,
      frontEndURL,
      backEndCode,
      backEndURL,
      task,
      title,
      check,
    } = req.body;

    // Get token from request
    const token = getTokenFrom(req);

    // Verify the token
    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout, please login again" });
    }

    // Get logged student to store task
    const student = await Student.findById(decodedToken.id);

    // Check if task is already submitted
    const matchedTask = await Task.findOne({ check });
    if (matchedTask) {
      res.status(400).json({ message: "Task already submitted" });
      return;
    }

    // Prepare data to push into task collection
    const newTask = new Task({
      day,
      frontEndCode,
      frontEndURL,
      backEndCode,
      backEndURL,
      task,
      title,
      check,
      student: student._id,
    });

    // Save new task in collection
    const savedTask = await newTask.save();

    // Load task ID to student collection
    student.task = student.task.concat(savedTask._id);
    await student.save();

    // Send response
    res.status(200).json({ message: "Task submitted successfully" });
  } catch (error) {
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
