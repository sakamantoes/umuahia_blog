import { body, validationResult } from "express-validator";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";
import express from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import upload from "../middleware/upload.js";


const router = express.Router();

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, page = 1, limit = 10, featured } = req.query;

    let query = { isPublished: true };
    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;

    const posts = await Post.find(query)
      .populate("author", "username fullName")
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   GET api/posts/category/:category
// @desc    Get posts by category
// @access  Public
router.get("/category/:category", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({
      category: req.params.category,
      isPublished: true,
    })
      .populate("author", "username")
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments({
      category: req.params.category,
      isPublished: true,
    });

    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   GET api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username fullName",
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        msg: "Post not found",
      });
    }

    // Increment views
    await post.incrementViews();

    res.json({
      success: true,
      post,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  upload.single("image"), 
  auth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("category").isIn([
      "News & Updates",
      "Opportunities",
      "Lifestyle",
      "Culture",
      "Stories",
      "Resources",
    ]),
    body("content").not().isEmpty().withMessage("Content is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const {
        title,
        category,
        content,
        summary,
        tags,
        isFeatured,
      } = req.body;

      //  DEBUG
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      let imageUrl = "";

      //  USE MULTER FILE (NOT req.body.image)
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
      }

      //  HANDLE TAGS
      let formattedTags = [];
      if (tags) {
        if (typeof tags === "string") {
          formattedTags = tags.split(",").map(tag => tag.trim()).filter(Boolean);
        } else if (Array.isArray(tags)) {
          formattedTags = tags;
        }
      }

      const newPost = new Post({
        title,
        category,
        content,
        summary: summary || "",
        tags: formattedTags,
        isFeatured: isFeatured || false,
        author: req.user.id,
        isPublished: true,
        publishedAt: new Date(),
        image: imageUrl, // ✅ always controlled
      });

      const savedPost = await newPost.save();

      await savedPost.populate("author", "username fullName");

      return res.status(201).json({
        success: true,
        data: savedPost,
      });

    } catch (err) {
      console.error("CREATE ERROR:", err.message);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);


// @route   POST api/posts/:id/view
// @desc    Increment post views
// @access  Public
router.post("/:id/view", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private

router.put(
  "/:id",
  upload.single("image"), //  ADD THIS (you forgot it before)
  auth,
  async (req, res) => {
    try {
      const {
        title,
        category,
        content,
        summary,
        tags,
        isFeatured,
        isPublished,
      } = req.body;

      let updateData = {};

      if (title) updateData.title = title;
      if (category) updateData.category = category;
      if (content) updateData.content = content;
      if (summary !== undefined) updateData.summary = summary;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      if (isPublished !== undefined) updateData.isPublished = isPublished;

      //  HANDLE TAGS
      if (tags) {
        if (typeof tags === "string") {
          updateData.tags = tags.split(",").map(tag => tag.trim()).filter(Boolean);
        } else if (Array.isArray(tags)) {
          updateData.tags = tags;
        }
      }

      // HANDLE IMAGE (MULTER WAY)
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        updateData.image = uploadResult.secure_url;
      }

      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate("author", "username fullName");

      if (!post) {
        return res.status(404).json({
          success: false,
          msg: "Post not found",
        });
      }

      return res.json({
        success: true,
        msg: "Post updated successfully",
        data: post,
      });

    } catch (err) {
      console.error("UPDATE ERROR:", err.message);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        msg: "Post not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (post.image) {
      try {
        const publicId = post.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`umuahia_posts/${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      msg: "Post deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   GET api/posts/search/:query
// @desc    Search posts
// @access  Public
router.get("/search/:query", async (req, res) => {
  try {
    const posts = await Post.find(
      { $text: { $search: req.params.query } },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(20);

    res.json({
      success: true,
      posts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;