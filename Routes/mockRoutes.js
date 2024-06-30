import { Router } from "express";
import { fetchMock, postMock } from "../Controllers/mockController.js";

// Initialize the router
const mockRouter = Router();

// Define the routes
mockRouter.get("/student/mock", fetchMock);
mockRouter.post("/student/mock", postMock);

// Export the router
export default mockRouter;
