import mongoose from "mongoose";
import Follow from "../models/followModel.js";
import User from "../models/userModel.js";

// Follow User
export const followUser = async (req, res) => {
  try {
    const followingId = req.params.id;
    const followerId = req.user._id;

    // Validate MongoDB ID
    if (!mongoose.isValidObjectId(followingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    // Prevent self-following
    if (followingId === followerId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself.",
      });
    }

    // Check whether target user exists
    const userToFollow = await User.findById(followingId);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check existing relationship
    const alreadyFollowing = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (alreadyFollowing) {
      return res.status(400).json({
        success: false,
        message: "Already following this user.",
      });
    }

    // Create follow relationship
    await Follow.create({
      follower: followerId,
      following: followingId,
    });

    // Update counts
    await User.findByIdAndUpdate(followerId, {
      $inc: { followingCount: 1 },
    });

    await User.findByIdAndUpdate(followingId, {
      $inc: { followersCount: 1 },
    });

    return res.status(200).json({
      success: true,
      message: "User followed successfully.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Already following this user.",
      });
    }

    console.error("Follow user error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const followingId = req.params.id;
    const followerId = req.user._id;

    if (!mongoose.isValidObjectId(followingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const follow = await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: "Follow relationship not found.",
      });
    }

    await User.findByIdAndUpdate(followerId, {
      $inc: { followingCount: -1 },
    });

    await User.findByIdAndUpdate(followingId, {
      $inc: { followersCount: -1 },
    });

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully.",
    });
  } catch (error) {
    console.error("Unfollow user error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Following Users
export const getFollowingUsers = async (req, res) => {
  try {
    const follows = await Follow.find({
      follower: req.user._id,
    })
      .populate("following", "username fullName profilePicture isVerified")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Following users fetched successfully.",
      users: follows.map((item) => item.following).filter(Boolean),
    });
  } catch (error) {
    console.error("Get following users error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
