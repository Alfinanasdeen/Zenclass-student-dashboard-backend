import { Router } from "express";
import {
  fetchQuery,
  postQuery,
  deleteQuery,
} from "../Controllers/queryController.js";
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
const queryRouter = Router();

// Fetching query request
queryRouter.get("/student/query", authenticateToken, fetchQuery);

// posting query request
queryRouter.post("/student/query", authenticateToken, postQuery);

// Deleting query request
queryRouter.delete("/student/query/:id", authenticateToken, deleteQuery);

// Export the router
export default queryRouter;
