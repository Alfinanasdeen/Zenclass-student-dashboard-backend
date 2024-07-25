import { Router } from "express";
import { fetchLeave, postLeave, deleteLeave } from "../Controllers/leaveController.js";
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

// Initialize the router
const leaveRouter = Router();

// Fetching all leave requests
leaveRouter.get("/student/leave", authenticateToken,fetchLeave);

// Posting a new leave request
leaveRouter.post("/student/leave", authenticateToken,postLeave);

// Deleting a leave request by ID
leaveRouter.delete("/student/leave/:id",authenticateToken, deleteLeave);

// Export the router
export default leaveRouter;
