import express from "express";
import { body, validationResult } from "express-validator";
import Announcement from "../models/Announcement.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// @route   GET api/announcements
// @desc    Get all active announcements
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Deactivate expired announcements
    await Announcement.deactivateExpired();

    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    })
      .sort({ priority: -1, createdAt: -1 })
      .select("-createdBy");

    res.json({
      success: true,
      announcements,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   GET api/announcements/community/:community
// @desc    Get announcements for specific community
// @access  Public
router.get("/community/:community", async (req, res) => {
  try {
    await Announcement.deactivateExpired();

    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { targetCommunities: "All Communities" },
        { targetCommunities: req.params.community },
      ],
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    })
      .sort({ priority: -1, createdAt: -1 })
      .select("-createdBy");

    res.json({
      success: true,
      announcements,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   GET api/announcements/urgent
// @desc    Get urgent announcements for marquee
// @access  Public
router.get("/urgent", async (req, res) => {
  try {
    await Announcement.deactivateExpired();

    const announcements = await Announcement.find({
      isActive: true,
      priority: { $in: ["High", "Urgent"] },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("-createdBy");

    res.json({
      success: true,
      announcements,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   POST api/announcements
// @desc    Create announcement
// @access  Private
router.post(
  "/",
  auth,
  upload.single("image"),
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("content").not().isEmpty().withMessage("Content is required"),
    body("type").isIn(["General", "Urgent", "Event", "Opportunity", "Alert"]),
    body("priority").isIn(["Low", "Medium", "High", "Urgent"]),
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
        content,
        type,
        priority,
        targetCommunities,
        link,
        expiresAt,
      } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      // Parse targetCommunities
      let communities = targetCommunities;
      if (typeof targetCommunities === "string") {
        communities = targetCommunities.split(",").map((c) => c.trim());
      }

      const announcement = new Announcement({
        title,
        content,
        type,
        priority,
        targetCommunities: communities || ["All Communities"],
        image,
        link,
        expiresAt: expiresAt || null,
        createdBy: req.admin.id,
      });

      await announcement.save();

      res.json({
        success: true,
        msg: "Announcement created successfully",
        announcement,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },
);

// @route   GET api/announcements/admin/all
// @desc    Get all announcements for admin
// @access  Private
router.get("/admin/all", auth, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username fullName");

    res.json({
      success: true,
      announcements,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   PUT api/announcements/:id
// @desc    Update announcement
// @access  Private
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (
      updateData.targetCommunities &&
      typeof updateData.targetCommunities === "string"
    ) {
      updateData.targetCommunities = updateData.targetCommunities
        .split(",")
        .map((c) => c.trim());
    }

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        msg: "Announcement not found",
      });
    }

    res.json({
      success: true,
      msg: "Announcement updated successfully",
      announcement,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   DELETE api/announcements/:id
// @desc    Delete announcement
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        msg: "Announcement not found",
      });
    }

    res.json({
      success: true,
      msg: "Announcement deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   PATCH api/announcements/:id/toggle
// @desc    Toggle announcement status
// @access  Private
router.patch("/:id/toggle", auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        msg: "Announcement not found",
      });
    }

    announcement.isActive = !announcement.isActive;
    await announcement.save();

    res.json({
      success: true,
      msg: `Announcement ${announcement.isActive ? "activated" : "deactivated"}`,
      announcement,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   POST api/announcements/:id/view
// @desc    Increment announcement views
// @access  Public
router.post("/:id/view", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    );

    res.json({
      success: true,
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
