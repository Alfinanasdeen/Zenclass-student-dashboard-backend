import { Router } from "express";
import { fetchMock, postMock } from "../Controllers/mockController.js";
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
const mockRouter = Router();

// Define the routes
mockRouter.get("/student/mock",authenticateToken, fetchMock);
mockRouter.post("/student/mock",authenticateToken, postMock);

// Export the router
export default mockRouter;
