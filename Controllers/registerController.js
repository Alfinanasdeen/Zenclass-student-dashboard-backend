// controllers/registerController.js
import bcrypt from 'bcrypt';
import Student from '../Model/studentSchema.js';

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
