require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Challenge = require("./models/Challenge");

// Goal model
const goalSchema = new mongoose.Schema({
  target: { type: Number, default: 0 },
  completed: { type: Number, default: 0 }
});
const Goal = mongoose.model("Goal", goalSchema);

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* -------------------------------
   Challenges CRUD
--------------------------------*/
app.get("/api/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch {
    res.status(500).json({ message: "Error fetching challenges" });
  }
});

app.post("/api/challenges", async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    const newChallenge = await challenge.save();

    if (newChallenge.status === "Completed") {
      await Goal.updateOne({}, { $inc: { completed: 1 } });
    }
    res.status(201).json(newChallenge);
  } catch {
    res.status(400).json({ message: "Error creating challenge" });
  }
});

app.put("/api/challenges/:id", async (req, res) => {
  try {
    const updatedChallenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedChallenge);
  } catch {
    res.status(400).json({ message: "Error updating challenge" });
  }
});

app.delete("/api/challenges/:id", async (req, res) => {
  try {
    const deletedChallenge = await Challenge.findByIdAndDelete(req.params.id);
    if (deletedChallenge?.status === "Completed") {
      await Goal.updateOne({}, { $inc: { completed: -1 } });
    }
    res.json({ message: "Challenge deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting challenge" });
  }
});

app.patch("/api/challenges/:id/toggle", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const wasCompleted = challenge.status === "Completed";
    challenge.status = wasCompleted ? "Pending" : "Completed";
    challenge.completedAt = challenge.status === "Completed" ? new Date() : null;
    await challenge.save();

    await Goal.updateOne({}, { $inc: { completed: wasCompleted ? -1 : 1 } });
    res.json(challenge);
  } catch {
    res.status(500).json({ message: "Error toggling challenge status" });
  }
});

/* -------------------------------
   Analytics Endpoint
--------------------------------*/
app.get("/api/analytics", async (req, res) => {
  try {
    const total = await Challenge.countDocuments();
    const completed = await Challenge.countDocuments({ status: "Completed" });
    const pending = total - completed;
    const successRate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

    const completedChallenges = await Challenge.find({
      status: "Completed",
      completedAt: { $ne: null }
    }).sort({ completedAt: -1 });

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let ch of completedChallenges) {
      const compDate = new Date(ch.completedAt);
      compDate.setHours(0, 0, 0, 0);

      if (compDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (compDate.getTime() === currentDate.getTime() - 86400000) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({ total, completed, pending, successRate, streak });
  } catch {
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

/* -------------------------------
   Goals Endpoints
--------------------------------*/
app.get("/api/goals", async (req, res) => {
  try {
    let goal = await Goal.findOne();
    if (!goal) {
      goal = new Goal({ target: 0, completed: 0 });
      await goal.save();
    }
    res.json(goal);
  } catch {
    res.status(500).json({ message: "Error fetching goal" });
  }
});

app.post("/api/goals", async (req, res) => {
  try {
    const { target } = req.body;
    let goal = await Goal.findOne();
    if (!goal) {
      goal = new Goal({ target, completed: 0 });
    } else {
      goal.target = target;
    }
    await goal.save();
    res.json(goal);
  } catch {
    res.status(500).json({ message: "Error saving goal" });
  }
});

/* -------------------------------
   Server Start
--------------------------------*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
