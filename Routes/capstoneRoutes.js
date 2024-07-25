import { Router } from "express";
import {
  fetchCapstone,
  postCapstone,
} from "../Controllers/capstoneController.js";
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
const capstoneRouter = Router();

// Fetching all capstone projects
capstoneRouter.get("/student/capstone", authenticateToken, fetchCapstone);

// Posting new capstone data
capstoneRouter.post("/student/capstone", authenticateToken, postCapstone);

// Export the router
export default capstoneRouter;
