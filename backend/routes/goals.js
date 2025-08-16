// routes/goals.js
const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

router.put('/:id/progress', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (goal.lastUpdatedDate) {
      const last = new Date(goal.lastUpdatedDate);
      last.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // consecutive day → increase streak
        goal.currentStreak++;
      } else if (diffDays > 1) {
        // missed a day → reset streak
        goal.currentStreak = 1;
      } // if diffDays === 0 → same day → no streak change
    } else {
      // first time logging progress
      goal.currentStreak = 1;
    }

    // update best streak if needed
    if (goal.currentStreak > goal.bestStreak) {
      goal.bestStreak = goal.currentStreak;
    }

    goal.lastUpdatedDate = today;
    await goal.save();

    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
