import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['General', 'Urgent', 'Event', 'Opportunity', 'Alert'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  targetCommunities: [{
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
      'All Communities'
    ]
  }],
  image: {
    type: String
  },
  link: {
    type: String,
    match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please enter a valid URL']
  },
  expiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Check if announcement is expired
AnnouncementSchema.methods.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt;
};

// Auto-deactivate expired announcements
AnnouncementSchema.statics.deactivateExpired = function() {
  return this.updateMany(
    { expiresAt: { $lt: new Date() }, isActive: true },
    { isActive: false }
  );
};

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

export default Announcement;  