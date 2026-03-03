
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import express from 'express';

const router = express.Router();

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10, featured } = req.query;
    
    let query = { isPublished: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    
    const posts = await Post.find(query)
      .populate('author', 'username fullName')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments(query);
    
    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   GET api/posts/category/:category
// @desc    Get posts by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const posts = await Post.find({ 
      category: req.params.category,
      isPublished: true 
    })
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments({ 
      category: req.params.category,
      isPublished: true 
    });
    
    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   GET api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullName');
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        msg: 'Post not found' 
      });
    }
    
    // Increment views
    await post.incrementViews();
    
    res.json({
      success: true,
      post
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, upload.single('image'), [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('category').isIn(['News & Updates', 'Opportunities', 'Lifestyle', 'Culture', 'Stories', 'Resources']),
  body('content').not().isEmpty().withMessage('Content is required')
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
    const { title, category, content, summary, tags, isFeatured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const post = new Post({
      title,
      category,
      content,
      summary: summary || content.substring(0, 200),
      image,
      author: req.admin.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isFeatured: isFeatured === 'true'
    });

    await post.save();

    res.json({
      success: true,
      msg: 'Post created successfully',
      post
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ 
        success: false,
        msg: 'Post not found' 
      });
    }

    res.json({
      success: true,
      msg: 'Post updated successfully',
      post
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        msg: 'Post not found' 
      });
    }

    res.json({
      success: true,
      msg: 'Post deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// @route   GET api/posts/search/:query
// @desc    Search posts
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const posts = await Post.find(
      { $text: { $search: req.params.query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);
    
    res.json({
      success: true,
      posts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

export default  router;