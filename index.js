import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectToMongoDB from "./data.config.js";
import { fileURLToPath } from "url";
import path from "path";

// Importing routers
import loginRouter from "./Routes/loginRoutes.js";
import studentRouter from "./Routes/studentRoutes.js";
import taskRouter from "./Routes/taskRoutes.js";
import leaveRouter from "./Routes/leaveRoutes.js";
import portfolioRouter from "./Routes/portfolioRoutes.js";
import capstoneRouter from "./Routes/capstoneRoutes.js";
import webcodeRouter from "./Routes/webcodeRoutes.js";
import queryRouter from "./Routes/queryRoutes.js";
import mockRouter from "./Routes/mockRoutes.js";

// Determine which environment file to load
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: path.resolve(__dirname, envPath) });

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const hostname = "0.0.0.0";
const PORT = process.env.PORT || 3000;

connectToMongoDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);
console.log(cors.origin);

app.get("/", (req, res) => {
  res.send("Welcome to Zen-Dashboard");
});

// Public routes
app.use("/", loginRouter);
app.use("/student", studentRouter);

// Protected routes - Apply JWT token authentication middleware here
import { authenticateToken } from "./Middleware/authMiddleware.js"; // Adjust the path as per your file structure
app.use(authenticateToken);

app.use(taskRouter);
app.use(leaveRouter);
app.use(portfolioRouter);
app.use(capstoneRouter);
app.use(webcodeRouter);
app.use(queryRouter);
app.use(mockRouter);

app.listen(PORT, () =>
  console.log(`Server running at http://${hostname}:${PORT}`)
);
