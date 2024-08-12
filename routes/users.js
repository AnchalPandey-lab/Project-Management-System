import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { userName, designation, assignedProject, emailId, password } = req.body;
  try {
    let user = await User.findOne({ emailId });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      userName,
      designation,
      assignedProject,
      emailId,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.send('User registered successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.designation
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.designation });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all users route
router.get('/getUsersDetails', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from the results
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user counts by designation
router.get('/userCounts', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const superAdmin = await User.countDocuments({ designation: 'Super Admin' });
    const seniorEngineers = await User.countDocuments({ designation: 'Senior Engineer' });
    const juniorEngineers = await User.countDocuments({ designation: 'Junior Engineer' });
    const otherUsers = totalUsers - seniorEngineers - juniorEngineers;

    res.json({
      totalUsers,
      seniorEngineers,
      juniorEngineers,
      otherUsers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
