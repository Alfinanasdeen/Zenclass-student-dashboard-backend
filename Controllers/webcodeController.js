import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Webcode from "../Model/webcodeSchema.js";
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

// Function to extract token from request headers using optional chaining
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  return authorization?.startsWith("Bearer ")
    ? authorization.replace("Bearer ", "")
    : undefined;
};

// Fetch all webcodes for a specific student
const fetchWebcode = async (req, res) => {
  try {
    // Get token from request
    const token = getTokenFrom(req);
    if (!token) {
      console.log("No token found");
      return res
        .status(401)
        .json({ message: "Session timeout, please login again" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      console.log("Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    // Fetch and populate webcodes for the student
    const student = await Student.findById(decodedToken.id).populate("webcode");
    if (!student) {
      console.log("Student not found");
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student.webcode);
  } catch (error) {
    console.error("Error fetching webcode:", error);
    return res
      .status(500)
      .json({ message: "Error fetching data, please try again later" });
  }
};

// Post new webcode data
const postWebcode = async (req, res) => {
  try {
    // Extract request body content
    const { feUrl, feCode } = req.body;

    // Get token from request
    const token = getTokenFrom(req);

    // Verify the token
    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout, please login again" });
    }

    // Check if webcode is already submitted
    const student = await Student.findById(decodedToken.id).populate("webcode");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.webcode.length > 0) {
      return res.status(400).json({ message: "Webcode already submitted" });
    }

    // Prepare new webcode instance
    const newWebcode = new Webcode({
      feUrl,
      feCode,
      student: student._id,
    });

    // Save new webcode
    const savedWebcode = await newWebcode.save();

    // Update student with new webcode ID
    student.webcode.push(savedWebcode._id);
    await student.save();

    // Send success response
    res.status(200).json({ message: "Webcode submitted successfully" });
  } catch (error) {
    console.error("Error submitting webcode:", error);
    return res
      .status(500)
      .json({ message: "Error on updating, please try again later" });
  }
};

export { fetchWebcode, postWebcode };
