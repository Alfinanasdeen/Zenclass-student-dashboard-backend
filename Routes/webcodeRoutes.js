import { Router } from "express";
import { fetchWebcode, postWebcode } from "../Controllers/webcodeController.js";
import { authenticateToken } from "../Middleware/authMiddleware.js";

const webcodeRouter = Router();

// Route to fetch all webcode
webcodeRouter.get("/student/webcode", authenticateToken, fetchWebcode);

// Route to post new webcode data
webcodeRouter.post("/student/webcode", authenticateToken, postWebcode);

export default webcodeRouter;
