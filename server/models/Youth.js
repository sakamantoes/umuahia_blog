import mongoose from 'mongoose';

const YouthSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  community: {
    type: String,
    enum: [
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
    ],
    required: [true, 'Community is required']
  },
  village: {
    type: String,
    required: [true, 'Village is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [15, 'Age must be at least 15'],
    max: [45, 'Age must be at most 45']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  occupation: {
    type: String,
    trim: true
  },
  education: {
    type: String,
    enum: ['None', 'Primary', 'Secondary', 'OND/NCE', 'HND/BSc', 'MSc/PhD'],
    default: 'None'
  },
  skills: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
YouthSchema.pre('save', function() {
  this.lastUpdated = new Date();
});

// Virtual for age group
YouthSchema.virtual('ageGroup').get(function() {
  if (this.age < 18) return 'Minor';
  if (this.age < 25) return 'Young Adult';
  if (this.age < 35) return 'Adult';
  return 'Elder Youth';
});

const Youth = mongoose.model('Youth', YouthSchema);

export default Youth;