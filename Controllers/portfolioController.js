import jwt from "jsonwebtoken";
import Student from "../Model/studentSchema.js";
import Portfolio from "../Model/portfolioSchema.js";

const SECRET = process.env.JWT_SECRET;

// Function to extract token from request headers
const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.replace("Bearer ", "") : undefined;
  return token;
};

// Fetch all portfolios for authenticated student
const fetchPortfolio = async (req, res) => {
  try {
    const token = getTokenFrom(req);
    if (!token) {
      return res.status(401).json({ message: "Session timeout, please login again" });
    }

    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ message: "Token invalid" });
    }

    const portfolios = await Student.findById(decodedToken.id).populate("portfolio");
    if (!portfolios) {
      return res.status(404).json({ message: "No portfolios found" });
    }

    res.status(200).json(portfolios.portfolio);
  } catch (error) {
    return res.status(400).json({ message: "Error fetching data, please login & try again" });
  }
};

// Post new portfolio data for authenticated student
const postPortfolio = async (req, res) => {
  try {
    const { portfolioURL, githubURL, resumeURL } = req.body;
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ message: "Session timeout, please login again" });
    }

    const student = await Student.findById(decodedToken.id).populate("portfolio");
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
    return res.status(400).json({ message: "Error submitting portfolio" });
  }
};

export { fetchPortfolio, postPortfolio };
