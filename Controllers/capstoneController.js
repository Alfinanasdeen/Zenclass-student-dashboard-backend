import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Capstone from "../Model/capstoneSchema.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

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

// Function to extract token from request headers
const getTokenFrom = (req) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.substring(7); // Remove 'Bearer ' to get token
  }
  return null;
};

// Fetch all capstones for authenticated student
const fetchCapstone = async (req, res) => {
  try {
    // Extract the token from the request headers
    const token = getTokenFrom(req);
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, SECRET);
    console.log("Decoded Token:", decodedToken);

    if (!decodedToken.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Find the student and populate capstone data
    const student = await Student.findById(decodedToken.id).populate(
      "capstone"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Capstone fetched successfully:", student.capstone);
    res.status(200).json(student.capstone);
  } catch (error) {
    console.error("Error fetching capstone:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// Post new capstone data for authenticated student
const postCapstone = async (req, res) => {
  try {
    const { feUrl, beUrl, feCode, beCode } = req.body;
    const token = getTokenFrom(req);
    console.log("Extracted token:", token); // For debugging

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const decodedToken = jwt.verify(token, SECRET);
    console.log("Decoded Token:", decodedToken); // For debugging

    const { id } = decodedToken; // Extract id from decodedToken

    if (!id) {
      return res
        .status(401)
        .json({ message: "Session timeout, please login again" });
    }

    const student = await Student.findById(id).populate("capstone");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.capstone.length > 0) {
      return res.status(401).json({ message: "Already submitted capstone" });
    }

    const newCapstone = new Capstone({
      feUrl,
      beUrl,
      feCode,
      beCode,
      student: student._id,
    });

    const savedCapstone = await newCapstone.save();
    student.capstone.push(savedCapstone._id);
    await student.save();

    res.status(200).json({ message: "Capstone submitted successfully" });
  } catch (error) {
    console.error("Error submitting capstone:", error);
    return res.status(400).json({ message: "Error submitting capstone" });
  }
};

export { fetchCapstone, postCapstone };
