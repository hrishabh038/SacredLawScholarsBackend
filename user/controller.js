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
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "9h",
      }
    );

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

export const updateUser = async (req, res) => {
  try {
    const { username, email_address, full_name, password, bio } = req.body;
    const user_username = req.params.username;
    const updateData = {};

    // Check and update each field if provided
    if (username) updateData.username = username;
    if (email_address) updateData.email_address = email_address;
    if (full_name) updateData.full_name = full_name;
    if (bio) updateData.bio = bio;

    // If the password is provided, hash it before updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: user_username },
      updateData
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Delete user route by username
export const deleteUser = async (req, res) => {
  try {
    const user_username = req.params.username;

    const deletedUser = await User.findOneAndDelete({
      username: user_username,
    });

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Get all users route
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Get user by username route
export const getUserByUsername = async (req, res) => {
  try {
    const user_username = req.params.username;

    const user = await User.findOne({ username: user_username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
