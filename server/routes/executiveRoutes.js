import express from "express";
import Executive from "../models/Executive.js";
import auth from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/upload.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const router = express.Router();

// @route   GET api/executives
// @desc    Get all active executives
// @access  Public
router.get("/", async (req, res) => {
  try {
    const executives = await Executive.find({ isActive: true }).sort({
      order: 1,
    });

    res.json({
      success: true,
      executives,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   GET api/executives/admin/all
// @desc    Get all executives (admin only)
// @access  Private
router.get("/admin/all", auth, async (req, res) => {
  try {
    const executives = await Executive.find().sort({ order: 1 });

    res.json({
      success: true,
      executives,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   POST api/executives
// @desc    Create an executive
// @access  Private
router.post(
  "/",
  upload.single("image"),
  auth,
  async (req, res) => {
    try {
      const { name, title, description, order, isActive } = req.body;

      if (!name || !title) {
        return res.status(400).json({
          success: false,
          error: "Name and title are required",
        });
      }

      let imageUrl = "";

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
      }

      const executive = new Executive({
        name,
        title,
        description: description || "",
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        image: imageUrl,
      });

      await executive.save();

      res.status(201).json({
        success: true,
        executive,
      });
    } catch (err) {
      console.error("EXECUTIVE CREATE ERROR:", err.message);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// @route   PUT api/executives/:id
// @desc    Update an executive
// @access  Private
router.put("/:id", upload.single("image"), auth, async (req, res) => {
  try {
    const { name, title, description, order, isActive } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;

    if (isActive !== undefined) {
      updateData.isActive = isActive === "true" || isActive === true;
    }

    // Upload new image
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      updateData.image = uploadResult.secure_url;
    }

    // Prevent empty update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No data provided for update",
      });
    }

    const executive = await Executive.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!executive) {
      return res.status(404).json({
        success: false,
        msg: "Executive not found",
      });
    }

    res.json({
      success: true,
      executive,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   DELETE api/executives/:id
// @desc    Delete an executive
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const executive = await Executive.findById(req.params.id);

    if (!executive) {
      return res.status(404).json({
        success: false,
        msg: "Executive not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (executive.image) {
      try {
        const publicId = executive.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`umuahia_executives/${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    await Executive.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      msg: "Executive deleted successfully",
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
