import { Router } from "express";
import { fetchWebcode, postWebcode } from "../Controllers/webcodeController.js";
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

const webcodeRouter = Router();

// Route to fetch all webcode
webcodeRouter.get("/student/webcode", authenticateToken, fetchWebcode);

// Route to post new webcode data
webcodeRouter.post("/student/webcode", authenticateToken, postWebcode);

export default webcodeRouter;
