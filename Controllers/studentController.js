import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Student from "../Model/studentSchema.js";

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const FEURL = process.env.FRONTEND_URL;

const signupStudent = async (req, res) => {
  console.log("Signup request received:", req.body);
  try {
    const { email, name, lName, contactNo, experience, qualification, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const matchedStudent = await Student.findOne({ email });
    if (matchedStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `${FEURL}/confirm/${randomString}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      email,
      name,
      experience,
      qualification,
      lName,
      contactNo,
      password: hashedPassword,
      resetToken: randomString,
    });

    console.log("Student created:", student);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
    });

    const sendMail = async () => {
      await transporter.sendMail({
        from: `"Alfina" <${EMAIL_ADDRESS}>`,
        to: student.email,
        subject: "Confirm account",
        text: link,
      });
    };

    await sendMail();
    console.log("Confirmation email sent to:", student.email);

    res.status(201).json({ message: `Account created successfully ${student.name}` });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error on sign up, please try again" });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { email, name, lName, contactNo, qualification, experience, password } = req.body;

    const matchedStudent = await Student.findOne({ email });
    if (!matchedStudent) {
      return res.status(400).json({ message: "Please enter valid email / Entered email not registered" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    matchedStudent.name = name;
    matchedStudent.lName = lName;
    matchedStudent.contactNo = contactNo;
    matchedStudent.qualification = qualification;
    matchedStudent.experience = experience;
    matchedStudent.password = hashedPassword;

    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    res.status(201).json({ message: "Account updated successfully", matchedStudent });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error on updating, please try again later" });
  }
};

const confirmStudent = async (req, res) => {
  try {
    const resetToken = req.params.token;

    // Find student by resetToken
    const matchedStudent = await Student.findOne({ resetToken });

    if (!matchedStudent || matchedStudent.resetToken === "") {
      return res.status(400).json({ message: "Student not found or link expired" });
    }

    // Update student verification status
    matchedStudent.verified = true;
    matchedStudent.resetToken = "";

    await matchedStudent.save();

    res.status(200).json({
      message: `${matchedStudent.name}'s account has been verified successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error verifying student" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const matchedStudent = await Student.findOne({ email });

    if (!matchedStudent) {
      return res.status(400).json({
        message: "Please enter valid email / Entered email not registered",
      });
    }

    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `${FEURL}/reset/${randomString}`;

    matchedStudent.resetToken = randomString;
    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Alfina" <${EMAIL_ADDRESS}>`,
      to: matchedStudent.email,
      subject: "Reset Password",
      text: link,
    });

    res.status(201).json({ message: `Mail has been sent to ${matchedStudent.email}` });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error on updating, please try again later" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const resetToken = req.params.id;

    const matchedStudent = await Student.findOne({ resetToken });

    if (!matchedStudent || matchedStudent.resetToken === "") {
      return res.status(400).json({ message: "Student not found or reset link expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    matchedStudent.password = hashedPassword;
    matchedStudent.resetToken = "";

    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    res.status(201).json({
      message: `${matchedStudent.name}'s password has been updated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Student not found or reset link expired" });
  }
};

export {
  signupStudent,
  updateStudent,
  confirmStudent,
  forgotPassword,
  resetPassword,
};
