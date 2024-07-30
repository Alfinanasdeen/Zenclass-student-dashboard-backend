import { Router } from "express";
import {
  fetchPortfolio,
  postPortfolio,
} from "../Controllers/portfolioController.js";
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
const portfolioRouter = Router();

//Fetching portfolio
portfolioRouter.get("/student/portfolio", authenticateToken, fetchPortfolio);

// Posting portfolio 
portfolioRouter.post("/student/portfolio", authenticateToken, postPortfolio);

// Export the router
export default portfolioRouter;
