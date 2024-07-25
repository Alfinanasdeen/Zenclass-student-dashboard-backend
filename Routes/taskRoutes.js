import { Router } from "express";
import {
  fetchTask,
  postTask,
  fetchAllTasks,
  updateTaskScore,
} from "../Controllers/taskController.js";
import { authenticateToken } from "../Middleware/authMiddleware.js";
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

const taskRouter = Router();

// Fetching all tasks
taskRouter.get("/student/task", authenticateToken, fetchTask);

// Posting a new task
taskRouter.post("/student/task", authenticateToken, postTask);

// Fetching all tasks
taskRouter.get("/student/alltask", authenticateToken, fetchAllTasks);

// Updating task score
taskRouter.patch(
  "/student/task/evaluation",
  authenticateToken,
  updateTaskScore
);

export default taskRouter;
