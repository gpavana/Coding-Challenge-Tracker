const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  link: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  tags: { type: [String], default: [] },
  completedAt: { type: Date }, // date of completion
  createdAt: { type: Date, default: Date.now }
});

// When status changes to Completed, set completedAt automatically
challengeSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'Completed') {
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Challenge', challengeSchema);
