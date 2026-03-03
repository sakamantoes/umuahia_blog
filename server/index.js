import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import AdminRoutes from './routes/admin.js';
import YouthRoutes from './routes/youth.js';
import PostRoutes from './routes/posts.js';
import AnnouncementRoutes from './routes/announcement.js';
import ComplaintRoutes from './routes/complaint.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://godswilltrade2004_db_user:q3WG7VecnYGwE335@cluster0.jcc8ghr.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });


 
// Routes
app.use('/api/admin', AdminRoutes);
app.use('/api/youth', YouthRoutes);
app.use('/api/posts', PostRoutes);
app.use('/api/complaints', ComplaintRoutes);
app.use('/api/announcements', AnnouncementRoutes);


// Base route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Umuahia South Youth Platform API',
    version: '1.0.0',
    endpoints: {
      admin: '/api/admin',
      youth: '/api/youth',
      posts: '/api/posts',
      complaints: '/api/complaints',
      announcements: '/api/announcements'
    }
  });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});