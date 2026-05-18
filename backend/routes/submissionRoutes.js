const express = require("express");
const jwt = require("jsonwebtoken");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const User = require("../models/User");

const router = express.Router();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// SUBMIT CODE
router.post("/submit", auth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Demo logic:
    // If user code contains expected output, Accepted.
    // Otherwise Wrong Answer.
    const isAccepted = code.includes(problem.expectedOutput);

    const verdict = isAccepted ? "Accepted" : "Wrong Answer";
    const rewardGiven = isAccepted ? problem.reward : 0;

    const submission = await Submission.create({
      user: req.userId,
      problem: problem._id,
      code,
      language,
      verdict,
      rewardGiven,
    });

    if (isAccepted) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: {
          tokens: rewardGiven,
          problemsSolved: 1,
        },
      });
    }

    res.json({
      message: isAccepted
        ? "Submission successfully verified. Reward claimed."
        : "Your output did not match the expected output.",
      verdict,
      rewardGiven,
      submissionId: submission._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET MY SUBMISSIONS
router.get("/my", auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.userId })
      .populate("problem", "title difficulty reward")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LEADERBOARD
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .select("name tokens problemsSolved walletAddress")
      .sort({ tokens: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;