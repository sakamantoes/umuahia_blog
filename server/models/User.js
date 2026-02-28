import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  community: {
    type: String,
    required: true,
 enum: [
  'Umuahia Urban',
  'Ibeku',
  'Ohuhu',
  'Olokoro',
  'Ubakala',
  'Old Umuahia',
  'Amakama',
  'Nsirimo',
  'Ezeleke',
  'Ohiya',
  'Other'
]
  },
  address: {
    type: String,
    required: true
  },
  occupation: String,
  profileImage: String,
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);