import { Router } from "express";
import { fetchQuery, postQuery, deleteQuery } from "../Controllers/queryController.js";

// Initialize the router
const queryRouter = Router();

// Define the routes
queryRouter.get("/student/query", fetchQuery);
queryRouter.post("/student/query", postQuery);
queryRouter.delete("/student/query/:id", deleteQuery);

// Export the router
export default queryRouter;
