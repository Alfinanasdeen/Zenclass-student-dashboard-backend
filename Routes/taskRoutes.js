import { Router } from "express";
import {
  fetchTask,
  postTask,
  fetchAllTasks,
  updateTaskScore,
} from "../Controllers/taskController.js";
import { authenticateToken } from "../Middleware/authMiddleware.js";

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
