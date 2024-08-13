import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { userName, designation, assignedProject, emailId, password } =
    req.body;
  try {
    let user = await User.findOne({ emailId });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      userName,
      designation,
      assignedProject,
      emailId,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.designation,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.designation });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all users route
router.get("/getUsersDetails", async (req, res) => {
  try {
    const users = await User.find({ designation: { $ne: 'super admin' } }).select("-password"); // Exclude Super admins and the password from the results
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get user counts by designation
router.get("/userCounts", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const seniorEngineers = await User.countDocuments({
      designation: "senior engineer",
    });
    const juniorEngineers = await User.countDocuments({
      designation: "junior engineer",
    });
    const otherUsers = totalUsers - seniorEngineers - juniorEngineers;

    res.json({
      totalUsers,
      seniorEngineers,
      juniorEngineers,
      otherUsers,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete User by ID
router.delete("/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Get Engineers
router.get("/engineers", async (req, res) => {
  try {
    // Find all users with designation 'senior engineer' or 'junior engineer'
    const engineers = await User.find(
      {
        designation: { $in: ["senior engineer", "junior engineer"] },
      },
      { _id: 1, userName: 1, designation: 1 } // Only return the id, userName, and designation fields
    );

    // Separate senior and junior engineers
    const response = {
      senior: engineers.filter(
        (engineer) => engineer.designation === "senior engineer"
      ),
      junior: engineers.filter(
        (engineer) => engineer.designation === "junior engineer"
      ),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
