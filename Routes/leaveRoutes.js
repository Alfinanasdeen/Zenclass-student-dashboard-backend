import { Router } from "express";
import { fetchLeave, postLeave, deleteLeave } from "../Controllers/leaveController.js";

// Initialize the router
const leaveRouter = Router();

// Fetching all leave requests
leaveRouter.get("/student/leave", fetchLeave);

// Posting a new leave request
leaveRouter.post("/student/leave", postLeave);

// Deleting a leave request by ID
leaveRouter.delete("/student/leave/:id", deleteLeave);

// Export the router
export default leaveRouter;
