import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Mock from "../Model/mockSchema.js";
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

// Function to extract token from request headers
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.replace("Bearer ", "") : undefined;
  return token;
};

// Fetch all mock interviews for authenticated student
const fetchMock = async (req, res) => {
  try {
    const token = getTokenFrom(req);
    if (!token) {
      return res.status(401).json({ message: "Session timeout, please login again" });
    }

    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ message: "Token invalid" });
    }

    const mocks = await Student.findById(decodedToken.id).populate("mock");
    if (!mocks) {
      return res.status(404).json({ message: "No mock interviews found" });
    }

    res.status(200).json(mocks.mock);
  } catch (error) {
    return res.status(400).json({ message: "Error fetching data, please login & try again" });
  }
};

// Post new mock interview for authenticated student
const postMock = async (req, res) => {
  try {
    const {
      interviewDate,
      interviewerName,
      interviewRound,
      comment,
      logicalScore,
      overallScore,
    } = req.body;

    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ message: "Session timeout, please login again" });
    }

    const student = await Student.findById(decodedToken.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const newMock = new Mock({
      interviewDate,
      interviewerName,
      interviewRound,
      comment,
      logicalScore,
      overallScore,
      student: student._id,
    });

    const savedMock = await newMock.save();
    student.mock.push(savedMock._id);
    await student.save();

    res.status(200).json({ message: "Mock interview submitted successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error submitting mock interview" });
  }
};

export { fetchMock, postMock };
