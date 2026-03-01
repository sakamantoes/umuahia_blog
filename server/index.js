import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import createDefaultAdmin from './middleware/createDefaultAdmin.js';
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

  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://godswilltrade2004_db_user:q3WG7VecnYGwE335@cluster0.jcc8ghr.mongodb.net/?appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Call AFTER connection
    await createDefaultAdmin();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });


  app.use('/api/users', UserRoutes);
  app.use('/api/posts', PostRoutes);
  app.use('/api/youth', YouthRoutes);
  app.use('/api/admin', AdminRoutes);


app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});