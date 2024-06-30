import { Router } from "express";
import { fetchPortfolio, postPortfolio } from "../Controllers/portfolioController.js";

// Initialize the router
const portfolioRouter = Router();

// Define the routes
portfolioRouter.get("/student/portfolio", fetchPortfolio);
portfolioRouter.post("/student/portfolio", postPortfolio);

// Export the router
export default portfolioRouter;
