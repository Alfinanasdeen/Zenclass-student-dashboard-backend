import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

const getTokenFrom = (req) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.substring(7); // Remove 'Bearer ' to get token
  }
  return null;
};

const authenticateToken = (req, res, next) => {
  const token = getTokenFrom(req);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decoded; // Optional: Attach decoded token payload to request object
    next();
  });
};

export { authenticateToken };
