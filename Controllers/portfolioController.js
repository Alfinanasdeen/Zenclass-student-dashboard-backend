import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Portfolio from "../Model/portfolioSchema.js";

const SECRET = process.env.JWT_SECRET;

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.replace("Bearer ", "")
    : undefined;
  return token;
};

const fetchPortfolio = async (req, res) => {
  try {
    const token = getTokenFrom(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const student = await Student.findById(decodedToken.id).populate(
      "portfolio"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student.portfolio); // Send the student's portfolio data
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const postPortfolio = async (req, res) => {
  try {
    const { portfolioURL, githubURL, resumeURL } = req.body;
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const student = await Student.findById(decodedToken.id).populate(
      "portfolio"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.portfolio.length > 0) {
      return res.status(401).json({ message: "Already submitted portfolio" });
    }

    const newPortfolio = new Portfolio({
      portfolioURL,
      githubURL,
      resumeURL,
      student: student._id,
    });

    const savedPortfolio = await newPortfolio.save();
    student.portfolio.push(savedPortfolio._id);
    await student.save();

    res.status(200).json({ message: "Portfolio submitted successfully" });
  } catch (error) {
    console.error("Error submitting portfolio:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { fetchPortfolio, postPortfolio };
