import express from 'express';
import { body, validationResult } from 'express-validator';
import Youth from '../models/Youth.js'

const router = express.Router();

// @route   POST api/youth/register
// @desc    Register a new youth
// @access  Public
router.post('/register', [
  body('fullName').not().isEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('phone').not().isEmpty().withMessage('Phone number is required'),
  body('community').not().isEmpty().withMessage('Community is required'),
  body('village').not().isEmpty().withMessage('Village is required'),
  body('age').isInt({ min: 15, max: 45 }).withMessage('Age must be between 15 and 45'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { fullName, email, phone, community, village, age, gender, occupation } = req.body;

    // Check if youth already exists
    const existingYouth = await Youth.findOne({ email });
    if (existingYouth) {
      return res.status(400).json({ 
        success: false,
        msg: 'You are already registered in the youth list' 
      });
    }

    // Create new youth
    const youth = new Youth({
      fullName,
      email,
      phone,
      community,
      village,
      age,
      gender,
      occupation
    });

    await youth.save();

    res.json({ 
      success: true,
      msg: 'Successfully joined Umuahia South Youth List!',
      youth: {
        id: youth._id,
        fullName: youth.fullName,
        community: youth.community,
        village: youth.village
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   GET api/youth/check/:email
// @desc    Check if youth exists by email
// @access  Public
router.get('/check/:email', async (req, res) => {
  try {
    const youth = await Youth.findOne({ email: req.params.email });
    res.json({ 
      success: true,
      exists: !!youth 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   GET api/youth/communities
// @desc    Get list of communities
// @access  Public
router.get('/communities', (req, res) => {
  const communities = [
    'Umuahia Urban',
    'Ibeku',
    'Olokoro',
    'Ubakala',
    'Ohuhu',
    'Amachara',
    'Afugiri',
    'Umuda',
    'Umuhu',
    'Nkata',
    'Ezeleke',
    'Umuagu',
    'Umuawa',
    'Umueze',
    'Umueleke',
    'Others'
  ];
  
  res.json({
    success: true,
    communities
  });
});

export default router;