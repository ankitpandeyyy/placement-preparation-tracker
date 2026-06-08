import express from 'express';
import DSA from '../models/DSA.js';

const router = express.Router();

// Get all DSA problems
router.get('/', async (req, res) => {
  try {
    const problems = await DSA.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single DSA problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await DSA.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new DSA problem
router.post('/', async (req, res) => {
  const problem = new DSA(req.body);
  try {
    const newProblem = await problem.save();
    res.status(201).json(newProblem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a DSA problem
router.put('/:id', async (req, res) => {
  try {
    const problem = await DSA.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a DSA problem
router.delete('/:id', async (req, res) => {
  try {
    const problem = await DSA.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
