import express from "express";
import { body, validationResult } from "express-validator";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// @route   POST api/complaints
// @desc    Submit a complaint/remark
// @access  Public
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("message")
      .not()
      .isEmpty()
      .withMessage("Message is required")
      .isLength({ max: 1000 }),
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
      const { name, email, phone, message, category } = req.body;

      const complaint = new Complaint({
        name,
        email,
        phone,
        message,
        category: category || "General",
      });

      await complaint.save();

      res.json({
        success: true,
        msg: "Complaint submitted successfully. We will get back to you soon.",
        complaint: {
          id: complaint._id,
          status: complaint.status,
        },
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

// @route   GET api/complaints/status/:id
// @desc    Check complaint status
// @access  Public
router.get("/status/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).select(
      "name status createdAt response",
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

export default router;