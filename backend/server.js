import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import companyRoutes from './routes/companyRoutes.js';
import dsaRoutes from './routes/dsaRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

import { MongoMemoryServer } from 'mongodb-memory-server';

// Database Connection
import Company from './models/Company.js';
import DSA from './models/DSA.js';
import User from './models/User.js';

const seedDatabase = async () => {
  try {
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      console.log('Seeding initial data...');
      await Company.create([
        {
          name: 'HighRadius',
          role: 'Software Engineer',
          status: 'Interview',
          applicationDate: new Date('2026-04-20'),
          rounds: [
            { name: 'Aptitude', status: 'Cleared', date: new Date('2026-04-22') },
            { name: 'Technical Interview', status: 'Pending', date: new Date('2026-04-28') }
          ],
          notes: { questionsAsked: 'OOP concepts, React lifecycle', keyLearnings: 'Need to review system design' }
        },
        {
          name: 'Google',
          role: 'Frontend Developer',
          status: 'Applied',
          applicationDate: new Date('2026-04-25'),
          rounds: [],
          notes: {}
        },
        {
          name: 'Amazon',
          role: 'SDE 1',
          status: 'Rejected',
          applicationDate: new Date('2026-04-10'),
          rounds: [
            { name: 'Aptitude', status: 'Not Cleared', date: new Date('2026-04-15') }
          ],
          notes: { mistakesMade: 'Missed edge cases in DP problem' }
        }
      ]);
      
      await DSA.create([
        { 
          name: 'Two Sum', 
          difficulty: 'Easy', 
          topic: 'Arrays', 
          status: 'Solved',
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
          code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}'
        },
        { 
          name: 'Longest Palindromic Substring', 
          difficulty: 'Medium', 
          topic: 'Strings', 
          status: 'Attempted',
          description: 'Given a string s, return the longest palindromic substring in s.',
          code: 'function longestPalindrome(s) {\n  // TODO: implement expand around center\n  return "";\n}'
        },
        { 
          name: 'Merge K Sorted Lists', 
          difficulty: 'Hard', 
          topic: 'Linked List', 
          status: 'Unsolved',
          description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.',
          code: ''
        }
      ]);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      console.log('Seeding complete.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

const connectDB = async () => {
  try {
    console.log('Attempting to connect to local MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_tracker');
    console.log('Connected to local MongoDB');
    await seedDatabase();
  } catch (err) {
    console.warn('Local MongoDB connection failed. Falling back to in-memory database...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('Connected to in-memory MongoDB at', mongoUri);
      await seedDatabase();
    } catch (memoryErr) {
      console.error('Failed to start in-memory MongoDB:', memoryErr);
    }
  }
};

connectDB();

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Placement Tracker API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
