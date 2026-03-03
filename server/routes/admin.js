import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import Admin from "../models/Admin.js";
import Youth from "../models/Youth.js";
import Complaint from "../models/Complaint.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   POST api/admin/setup
// @desc    Create default admin (run once)
// @access  Public
router.post("/setup", async (req, res) => {
  try {
    const adminExists = await Admin.findOne({ username: "admin" });
    if (!adminExists) {
      const admin = new Admin({
        username: "admin",
        password: "admin123",
        fullName: "System Administrator",
        email: "admin@umuahiasouth.gov.ng",
        role: "super_admin",
      });
      await admin.save();
      res.json({
        success: true,
        msg: "Default admin created successfully",
        credentials: {
          username: "admin",
          password: "admin123",
        },
      });
    } else {
      res.json({
        success: true,
        msg: "Admin already exists",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   POST api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post(
  "/login",
  [
    body("username").not().isEmpty().withMessage("Username is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { username, password } = req.body;

      // Check if admin exists
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(400).json({
          success: false,
          msg: "Invalid credentials",
        });
      }

      // Validate password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          msg: "Invalid credentials",
        });
      }

      // Update last login
      await admin.updateLastLogin();

      // Create JWT payload
      const payload = {
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
        },
      };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token,
            admin: {
              id: admin.id,
              username: admin.username,
              fullName: admin.fullName,
              role: admin.role,
            },
          });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },
);

// @route   GET api/admin/verify
// @desc    Verify admin token
// @access  Private
router.get("/verify", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json({
      success: true,
      admin,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   GET api/admin/youths
// @desc    Get all registered youths
// @access  Private
router.get("/youths", auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, community, search } = req.query;

    let query = {};

    // Filter by community
    if (community) {
      query.community = community;
    }

    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const youths = await Youth.find(query)
      .sort({ dateJoined: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Youth.countDocuments(query);

    // Get statistics
    const stats = {
      total: await Youth.countDocuments(),
      byCommunity: await Youth.aggregate([
        { $group: { _id: "$community", count: { $sum: 1 } } },
      ]),
      byGender: await Youth.aggregate([
        { $group: { _id: "$gender", count: { $sum: 1 } } },
      ]),
      ageGroups: await Youth.aggregate([
        {
          $bucket: {
            groupBy: "$age",
            boundaries: [15, 20, 25, 30, 35, 40, 45],
            default: "Other",
            output: {
              count: { $sum: 1 },
            },
          },
        },
      ]),
    };

    res.json({
      success: true,
      youths,
      stats,
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

// @route   GET api/admin/youths/:id
// @desc    Get single youth by ID
// @access  Private
router.get("/youths/:id", auth, async (req, res) => {
  try {
    const youth = await Youth.findById(req.params.id);
    if (!youth) {
      return res.status(404).json({
        success: false,
        msg: "Youth not found",
      });
    }
    res.json({
      success: true,
      youth,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   PUT api/admin/youths/:id
// @desc    Update youth information
// @access  Private
router.put("/youths/:id", auth, async (req, res) => {
  try {
    const youth = await Youth.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!youth) {
      return res.status(404).json({
        success: false,
        msg: "Youth not found",
      });
    }

    res.json({
      success: true,
      youth,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   DELETE api/admin/youths/:id
// @desc    Delete youth
// @access  Private
router.delete("/youths/:id", auth, async (req, res) => {
  try {
    const youth = await Youth.findByIdAndDelete(req.params.id);
    if (!youth) {
      return res.status(404).json({
        success: false,
        msg: "Youth not found",
      });
    }
    res.json({
      success: true,
      msg: "Youth deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   GET api/admin/complaints
// @desc    Get all complaints
// @access  Private
router.get("/complaints", auth, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 50 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .populate("assignedTo", "username fullName")
      .populate("response.respondedBy", "username fullName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      complaints,
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

// @route   PUT api/admin/complaints/:id
// @desc    Update complaint status
// @access  Private
router.put("/complaints/:id", auth, async (req, res) => {
  try {
    const { status, response, priority } = req.body;

    let updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    if (response) {
      updateData.response = {
        message: response,
        respondedBy: req.admin.id,
        respondedAt: new Date(),
      };
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true },
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        msg: "Complaint not found",
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// @route   GET api/admin/stats
// @desc    Get dashboard statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const [
      totalYouth,
      totalComplaints,
      pendingComplaints,
      totalPosts,
      recentYouth,
      recentComplaints,
    ] = await Promise.all([
      Youth.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Pending" }),
      require("../models/Post").countDocuments(),
      Youth.find().sort({ dateJoined: -1 }).limit(5),
      Complaint.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        totalYouth,
        totalComplaints,
        pendingComplaints,
        totalPosts,
        recentYouth,
        recentComplaints,
      },
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
