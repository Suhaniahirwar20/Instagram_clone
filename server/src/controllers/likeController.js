import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Check whether the post exists
    const post = await Post.findOne({
      _id: postId,
      isDeleted: false,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check whether the user has already liked this post
    const alreadyLiked = await Like.findOne({
      user: req.user._id,
      post: postId,
    });

    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
      });
    }

    // Create like
    await Like.create({
      user: req.user._id,
      post: postId,
    });

    // Increment post likes count
    await Post.findByIdAndUpdate(postId, {
      $inc: { likesCount: 1 },
    });

    return res.status(201).json({
      success: true,
      message: "Post liked successfully",
    });
  } catch (error) {
    // Handle duplicate likes from simultaneous requests
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already liked this post",
      });
    }

    console.error("Like post error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find and remove the user's like
    const liked = await Like.findOneAndDelete({
      user: req.user._id,
      post: postId,
    });

    if (!liked) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    // Decrement post likes count
    await Post.findByIdAndUpdate(postId, {
      $inc: { likesCount: -1 },
    });

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
    });
  } catch (error) {
    console.error("Unlike post error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
