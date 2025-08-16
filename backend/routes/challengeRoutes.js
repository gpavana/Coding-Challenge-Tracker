const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

// Get all challenges
router.get('/', async (req, res) => {
    try {
        const challenges = await Challenge.find().sort({ date: -1 }); // newest first
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new challenge
router.post('/', async (req, res) => {
    const challenge = new Challenge(req.body);
    try {
        const newChallenge = await challenge.save();
        res.status(201).json(newChallenge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a challenge
router.put('/:id', async (req, res) => {
    try {
        const updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedChallenge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a challenge
router.delete('/:id', async (req, res) => {
    try {
        await Challenge.findByIdAndDelete(req.params.id);
        res.json({ message: 'Challenge deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
