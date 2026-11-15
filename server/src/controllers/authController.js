import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Like from "../models/likeModel.js";
import bcrypt from "bcrypt";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { username, fullName, email, password, profilePicture } = req.body;

    // Validate required fields
    if (!username || !fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Normalize input
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username: normalizedUsername,
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      profilePicture,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Send refresh token through secure cookie
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // Exclude sensitive fields
    const safeUser = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user: safeUser,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "ALL fields are required",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // Exclude sensitive fields
    const safeUser = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: safeUser,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/auth",
    });
    
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const me = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const posts = await Post.find({
      user: user._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((post) => post._id);

    const likes = await Like.find({
      post: { $in: postIds },
    }).populate("user", "username fullName profilePicture");

    const likesMap = {};

    likes.forEach((like) => {
      const postId = like.post.toString();

      if (!likesMap[postId]) {
        likesMap[postId] = [];
      }

      likesMap[postId].push(like);
    });

    const postsWithLikes = posts.map((post) => ({
      ...post,
      likes: likesMap[post._id.toString()] || [],
    }));

    res.status(200).json({
      success: true,
      user,
      posts: postsWithLikes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
