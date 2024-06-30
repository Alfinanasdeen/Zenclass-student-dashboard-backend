import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Capstone from "../Model/capstoneSchema.js";

const SECRET = process.env.JWT_SECRET;

// Function to extract token from request headers using optional chaining
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.replace("Bearer ", "") : undefined;
  return token;
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = getTokenFrom(req);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decodedToken = jwt.verify(token, SECRET);
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// Fetch all capstones for authenticated student
const fetchCapstone = async (req, res) => {
  try {
    const { id } = req.decodedToken;
    const student = await Student.findById(id).populate("capstone");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student.capstone);
  } catch (error) {
    return res.status(400).json({ message: "Error fetching data" });
  }
};

// Post new capstone data for authenticated student
const postCapstone = async (req, res) => {
  try {
    const { feUrl, beUrl, feCode, beCode } = req.body;
    const { id } = req.decodedToken;

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
    return res.status(400).json({ message: "Error submitting capstone" });
  }
};

export { authenticateToken, fetchCapstone, postCapstone };
