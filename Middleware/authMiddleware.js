import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

const getTokenFrom = (req) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.substring(7);
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
