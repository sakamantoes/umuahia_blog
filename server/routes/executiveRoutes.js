import express from 'express';
import { body, validationResult } from 'express-validator';
import Executive from '../models/Executive.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   GET api/executives
// @desc    Get all active executives (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const executives = await Executive.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      executives
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   GET api/executives/admin/all
// @desc    Get all executives for admin (including inactive)
// @access  Private
router.get('/admin/all', auth, async (req, res) => {
  try {
    const executives = await Executive.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      executives
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   POST api/executives
// @desc    Create a new executive
// @access  Private
router.post('/', auth, upload.single('image'), [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('title').not().isEmpty().withMessage('Title is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { name, title, description, order } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        msg: 'Image is required' 
      });
    }

    const image = `/uploads/${req.file.filename}`;

    const executive = new Executive({
      name,
      title,
      description,
      image,
      order: order || 0
    });

    await executive.save();

    res.json({
      success: true,
      msg: 'Executive added successfully',
      executive
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   PUT api/executives/:id
// @desc    Update an executive
// @access  Private
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, title, description, order, isActive } = req.body;
    
    let updateData = { name, title, description, order, isActive };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const executive = await Executive.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!executive) {
      return res.status(404).json({ 
        success: false,
        msg: 'Executive not found' 
      });
    }

    res.json({
      success: true,
      msg: 'Executive updated successfully',
      executive
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   DELETE api/executives/:id
// @desc    Delete an executive
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const executive = await Executive.findByIdAndDelete(req.params.id);
    
    if (!executive) {
      return res.status(404).json({ 
        success: false,
        msg: 'Executive not found' 
      });
    }

    res.json({
      success: true,
      msg: 'Executive deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

export default router;