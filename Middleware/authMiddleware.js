import jwt from "jsonwebtoken";
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
console.log("JWT_SECRET:", process.env.JWT_SECRET);



const getTokenFrom = (req) => {
  const authorization = req.headers.authorization;
  console.log("Authorization header:", authorization);
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.substring(7);
    console.log("Extracted token:", token);
    return token;
  }
  return null;
};

const authenticateToken = (req, res, next) => {
  const token = getTokenFrom(req);
  console.log("Token received in request:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decoded;
    console.log("Decoded user information:", decoded);
    next();
  });
};

export { authenticateToken };
