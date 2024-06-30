import { Router } from "express";
import { login } from "../Controllers/loginController.js";
import { registerStudent } from "../Controllers/registerController.js";

// Initialize the router
const loginRouter = Router();

// Define the login route
loginRouter.post("/student/login", login);
// loginRouter.post("/student/register", registerStudent);

// Export the router
export default loginRouter;
