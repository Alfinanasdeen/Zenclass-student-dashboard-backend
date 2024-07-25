import { Router } from "express";
import {
  signupStudent,
  updateStudent,
  confirmStudent,
  forgotPassword,
  resetPassword,
} from "../Controllers/studentController.js";
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
