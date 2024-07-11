import { Router } from "express";
import {
  fetchPortfolio,
  postPortfolio,
} from "../Controllers/portfolioController.js";
import { authenticateToken } from "../Middleware/authMiddleware.js";

// Initialize the router
const portfolioRouter = Router();

// Define the routes
portfolioRouter.get("/student/portfolio", authenticateToken, fetchPortfolio);
portfolioRouter.post("/student/portfolio", authenticateToken, postPortfolio);

// Export the router
export default portfolioRouter;
