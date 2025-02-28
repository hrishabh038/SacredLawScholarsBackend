import User from "./schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register route
export const register = async (req, res) => {
  try {
    const { username, email_address, full_name, password, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email_address }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email_address,
      full_name,
      password: hashedPassword,
      bio,
      role: "user", // default to 'user'
    });

    // Save user to database
    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User registered",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Login route
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "9h",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      data: user.username,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
