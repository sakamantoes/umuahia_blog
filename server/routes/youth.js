import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get all youth (public)
router.get('/', async (req, res) => {
  try {
    const { community } = req.query;
    let query = { role: 'user' }; // Only get users with role 'user'
    
    if (community) {
      query.community = community;
    }

    const youth = await User.find(query).select('-password');
    res.json(youth);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get youth stats
router.get('/stats', async (req, res) => {
  try {
    const total = await User.countDocuments();
    const byCommunity = await User.aggregate([
      { $group: { _id: '$community', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      byCommunity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single youth profile
router.get('/:id', async (req, res) => {
  try {
    const youth = await User.findById(req.params.id).select('-password');
    if (!youth) {
      return res.status(404).json({ message: 'Youth not found' });
    }
    res.json(youth);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;