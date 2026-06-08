import mongoose from 'mongoose';

const dsaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Solved', 'Unsolved', 'Attempted'],
      default: 'Unsolved',
    },
    link: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const DSA = mongoose.model('DSA', dsaSchema);

export default DSA;
