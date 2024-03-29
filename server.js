const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/studentModel");
const Student_Grade = require("./models/studentGradesModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//default route
app.get("/", (req, res) => {
  res.send("SUCCESS");
});
//student grade
app.get("/student-grades/:ID", async (req, res) => {
  try {
    const ID = req.params.ID;
    const studentGrade = await Student_Grade.find({ ID: ID });
    res.status(200).json(studentGrade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
  const { Email } = req.body;

  try {
    // Check if the email is already taken
    const existingUser = await Student.findOne({ Email });

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
