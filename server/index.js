import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import { fileURLToPath } from 'url';

import UserRoutes from './routes/auth.js';
import PostRoutes from './routes/posts.js';
import YouthRoutes from './routes/youth.js';
import AdminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://godswilltrade2004_db_user:q3WG7VecnYGwE335@cluster0.jcc8ghr.mongodb.net/?appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  // After mongoose.connect
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const admin = new User({
        fullName: 'System Administrator',
        email: 'admin@umuahiasouth.gov.ng',
        phone: '08012345678',
        dateOfBirth: new Date('1990-01-01'),
        community: 'Umuahia Urban',
        address: 'Umuahia South LGA Secretariat',
        occupation: 'Administrator',
        password: hashedPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('Default admin created:');
      console.log('Email: admin@umuahiasouth.gov.ng');
      console.log( hashedPassword); //Admin@123 is the password 
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Call this after database connection
createDefaultAdmin();

  app.use('/api/users', UserRoutes);
  app.use('/api/posts', PostRoutes);
  app.use('/api/youth', YouthRoutes);
  app.use('/api/admin', AdminRoutes);


app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
}
)