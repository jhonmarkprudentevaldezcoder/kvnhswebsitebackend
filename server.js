const express = require("express");
const cors = require("cors");
const httpProxy = require("http-proxy");
const mongoose = require("mongoose");
const Student = require("./models/studentModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const proxy = httpProxy.createProxyServer();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//default route
app.get("/", (req, res) => {
  res.send("SUCCESS");
});

// fetch all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//register
app.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is already taken
    const existingUser = await Student.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already taken." });
    }

    // If the email is not taken, create the user
    const student = await Student.create(req.body);
    res.status(200).json(student);
    console.log("User registered!");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//login

app.post("/login", async (req, res) => {
  const { Username, Password } = req.body;

  try {
    // Find the user by email
    const student = await Student.findOne({ Username });

    if (!student) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    // Compare the provided password with the stored password
    if (student.Password !== Password) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: student._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    // Set the token as a cookie (optional)
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    // Respond with the token as a Bearer token
    res.status(200).json({
      message: "Authentication successful",
      token: `${token}`,
      userId: student._id,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//check authentication

function authenticateToken(req, res, next) {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Missing or invalid token." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace("Bearer ", ""), "your-secret-key");

    // Attach the decoded user information to the request object
    req.patient = decoded;

    // Continue to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
}

app.get("/protected", authenticateToken, (req, res) => {
  // If the middleware passes, the user is authenticated
  // You can access the user information from req.user
  res.status(200).json({
    message: "Protected resource accessed by user: " + req.patient.userId,
  });
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://chrispy:asandaddymobeh@cluster0.1tzwrd2.mongodb.net/StudentRecordManagementSystem"
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Node API app is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
