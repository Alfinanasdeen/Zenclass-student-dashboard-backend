import { Router } from "express";
import { fetchCapstone, postCapstone } from "../Controllers/capstoneController.js";

// Initialize the router
const capstoneRouter = Router();

// Fetching all capstone projects
capstoneRouter.get("/student/capstone", fetchCapstone);

// Posting new capstone data
capstoneRouter.post("/student/capstone", postCapstone);

// Export the router
export default capstoneRouter;
