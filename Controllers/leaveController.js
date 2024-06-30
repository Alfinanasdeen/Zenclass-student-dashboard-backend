import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Leave from "../Model/leaveSchema.js";

const SECRET = process.env.JWT_SECRET;

// Function to extract token from request headers
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.replace("Bearer ", "") : undefined;
  return token;
};

// Fetch all leave records for authenticated student
const fetchLeave = async (req, res) => {
  try {
    const token = getTokenFrom(req);
    if (!token) {
      return res.status(401).json({ message: "Session timeout, please login again" });
    }

    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const leaves = await Student.findById(decodedToken.id).populate("leave");
    if (!leaves) {
      return res.status(404).json({ message: "No leave records found" });
    }

    res.status(200).json(leaves.leave);
  } catch (error) {
    return res.status(400).json({ message: "Error fetching data, please login and try again" });
  }
};

// Post new leave application
const postLeave = async (req, res) => {
  try {
    const { reason, appliedOn } = req.body;
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, SECRET);

    if (!decodedToken?.id) {
      return res.status(401).json({ message: "Session timeout, please login again" });
    }

    const student = await Student.findById(decodedToken.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const newLeave = new Leave({
      reason,
      appliedOn,
      student: student._id,
    });

    const savedLeave = await newLeave.save();
    student.leave.push(savedLeave._id);
    await student.save();

    res.status(200).json({ message: "Leave submitted successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error submitting leave application" });
  }
};

// Delete a leave record
const deleteLeave = async (req, res) => {
  try {
    const id = req.params.id;
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, SECRET);

    if (!decodedToken?.id) {
      return res.status(401).json({ message: "Session timeout, please login again" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave data not found" });
    }

    await Leave.findByIdAndDelete(id);

    await Student.findByIdAndUpdate(
      decodedToken.id,
      { $pull: { leave: id } },
      { new: true }
    );

    res.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting leave record" });
  }
};

export { fetchLeave, postLeave, deleteLeave };
