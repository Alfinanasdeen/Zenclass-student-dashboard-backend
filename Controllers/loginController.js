import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Student from "../Model/studentSchema.js";
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
const SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request:", email);

    // Find student document by email
    const student = await Student.findOne({ email });
    console.log("Found student:", student);

    // Handle cases where student is not found
    if (!student) {
      console.log("Student not found");
      return res
        .status(401)
        .json({ message: "Invalid username/Please sign up" });
    }

    // Compare password using bcrypt
    const passwordMatch = await bcrypt.compare(password, student.password);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      console.log("Incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const studentToken = {
      name: student.name,
      id: student._id,
    };

    // Ensure SECRET is defined and not empty
    if (!SECRET) {
      console.error("JWT_SECRET not defined in environment variables.");
      return res.status(500).json({ message: "Internal server error" });
    }

    const token = jwt.sign(studentToken, SECRET, { expiresIn: "1h" });
    console.log("Generated token:", token);

    // Respond with token and student details
    console.log("Login successful");
    res.status(200).json({ token, student });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Error on sign in, please try again" });
  }
};

export { login };
