import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Aptitude', 'Group Discussion', 'Technical Interview', 'HR Interview', 'Communication Round', 'DSA Round', 'Online Assessment', 'Other'],
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Cleared', 'Not Cleared'],
    default: 'Pending',
  },
  date: {
    type: Date,
  },
  notes: {
    type: String,
  },
});

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Applied', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    rounds: [roundSchema],
    notes: {
      questionsAsked: { type: String, default: '' },
      mistakesMade: { type: String, default: '' },
      keyLearnings: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;
