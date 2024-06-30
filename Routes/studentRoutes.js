import { Router } from "express";
import {
  signupStudent,
  updateStudent,
  confirmStudent,
  forgotPassword,
  resetPassword,
} from "../Controllers/studentController.js";

const studentRouter = Router();

// Sign up new student
studentRouter.post("/signup", signupStudent);

// Update student profile
studentRouter.put("/update", updateStudent);

// Confirm/authenticate student account
studentRouter.patch("/confirm/:id", confirmStudent);

// Create link for resetting password
studentRouter.put("/forgot", forgotPassword);

// Reset password
studentRouter.patch("/reset/:id", resetPassword);

export default studentRouter;
