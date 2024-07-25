import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Query from "../Model/querySchema.js";
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
  const token = authorization?.startsWith("Bearer ")
    ? authorization.replace("Bearer ", "")
    : undefined;
  return token;
};

// Fetch all queries for authenticated student
const fetchQuery = async (req, res) => {
  try {
    const token = getTokenFrom(req);
    console.log("Token received:", token); // Log token

    if (!token) {
      return res
        .status(401)
        .json({ message: "Session timeout, please login again" });
    }

    const decodedToken = jwt.verify(token, SECRET);
    console.log("Decoded token:", decodedToken); // Log decoded token

    if (!decodedToken.id) {
      return res.status(401).json({ message: "Token invalid" });
    }

    const queries = await Student.findById(decodedToken.id).populate("query");
    console.log("Fetched queries:", queries); // Log fetched queries

    if (!queries) {
      return res.status(404).json({ message: "No queries found" });
    }

    res.status(200).json(queries.query);
  } catch (error) {
    console.error("Error fetching queries:", error); // Log errors
    return res
      .status(400)
      .json({ message: "Error fetching data, please login & try again" });
  }
};

// Post new query data for authenticated student
const postQuery = async (req, res) => {
  try {
    const { queryTitle, queryDesc } = req.body;
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, SECRET);

    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout, please login again" });
    }

    const student = await Student.findById(decodedToken.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const newQuery = new Query({
      queryTitle,
      queryDesc,
      student: student._id,
    });

    const savedQuery = await newQuery.save();
    student.query.push(savedQuery._id);
    await student.save();

    res.status(200).json({ message: "Query applied successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error submitting query" });
  }
};

// Delete query for authenticated student
const deleteQuery = async (req, res) => {
  try {
    const id = req.params.id;
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, SECRET);

    if (!decodedToken.id) {
      return res
        .status(401)
        .json({ message: "Session timeout, please login again" });
    }

    const matchedQuery = await Query.findById(id);
    if (!matchedQuery) {
      return res.status(401).json({ message: "Query data not found" });
    }

    await Query.findByIdAndDelete(id);

    await Student.findByIdAndUpdate(
      decodedToken.id,
      {
        $pull: { query: id },
      },
      { new: true }
    );

    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting query" });
  }
};

export { fetchQuery, postQuery, deleteQuery };
