// controllers/registerController.js
import bcrypt from 'bcrypt';
import Student from '../Model/studentSchema.js';
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

// Function to register a new student
const registerStudent = async (req, res) => {
  const { name, lName, email, password } = req.body;

  try {
    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student document
    const newStudent = new Student({
      name,
      lName,
      email,
      password: hashedPassword,
    });

    await newStudent.save();

    res.status(201).json({ message: 'Student registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering student. Please try again.' });
  }
};

export { registerStudent };
