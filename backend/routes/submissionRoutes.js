const transferCCT = require("../services/tokenService");

const express = require("express");
const jwt = require("jsonwebtoken");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const User = require("../models/User");
const runCode = require("../services/judge0Service");

const router = express.Router();

const calculateLevel = (xp) => {
  if (xp >= 1000) return 5;
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
};

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isYesterday = (lastDate, today) => {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return isSameDay(lastDate, yesterday);
};

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

// RUN CODE USING JUDGE0
router.post("/run", auth, async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    const result = await runCode({
      code,
      language,
      stdin,
    });

    res.json({
      message: "Code executed successfully",
      output: result.stdout,
      error: result.stderr || result.compile_output,
      status: result.status,
      time: result.time,
      memory: result.memory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Code execution failed",
    });
  }
});

// SUBMIT CODE
// router.post("/submit", auth, async (req, res) => {
//   try {
//     const { problemId, code, language } = req.body;

//     const problem = await Problem.findById(problemId);

//     if (!problem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }

//     // Demo logic:
//     // If user code contains expected output, Accepted.
//     // Otherwise Wrong Answer.
//     const isAccepted = code.includes(problem.expectedOutput);

//     const verdict = isAccepted ? "Accepted" : "Wrong Answer";
//     const rewardGiven = isAccepted ? problem.reward : 0;

//     const submission = await Submission.create({
//       user: req.userId,
//       problem: problem._id,
//       code,
//       language,
//       verdict,
//       rewardGiven,
//     });

//     if (isAccepted) {
//       await User.findByIdAndUpdate(req.userId, {
//         $inc: {
//           tokens: rewardGiven,
//           problemsSolved: 1,
//         },
//       });
//     }

//     res.json({
//       message: isAccepted
//         ? "Submission successfully verified. Reward claimed."
//         : "Your output did not match the expected output.",
//       verdict,
//       rewardGiven,
//       submissionId: submission._id,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// router.post("/submit", auth, async (req, res) => {
//   try {
//     const { problemId, code, language } = req.body;

//     const problem = await Problem.findById(problemId);

//     if (!problem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }

//     const isAccepted = code.includes(problem.expectedOutput);

//     const verdict = isAccepted ? "Accepted" : "Wrong Answer";
//     const rewardGiven = isAccepted ? problem.reward : 0;

//     let txHash = "";

//     if (isAccepted) {
//       const user = await User.findById(req.userId);

//       if (!user.walletAddress) {
//         return res.status(400).json({
//           message: "Please connect MetaMask wallet before claiming reward.",
//         });
//       }

//       txHash = await transferCCT(user.walletAddress, rewardGiven);

//       await User.findByIdAndUpdate(req.userId, {
//         $inc: {
//           tokens: rewardGiven,
//           problemsSolved: 1,
//         },
//       });
//     }

//     const submission = await Submission.create({
//       user: req.userId,
//       problem: problem._id,
//       code,
//       language,
//       verdict,
//       rewardGiven,
//       txHash,
//     });

//     res.json({
//       message: isAccepted
//         ? "Submission verified. CCT token transferred to your MetaMask wallet."
//         : "Your output did not match the expected output.",
//       verdict,
//       rewardGiven,
//       txHash,
//       submissionId: submission._id,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// router.post("/submit", auth, async (req, res) => {
//   try {
//     const { problemId, code, language } = req.body;

//     const problem = await Problem.findById(problemId);

//     if (!problem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }

//     const judgeResult = await runCode({
//       code,
//       language,
//       stdin: "",
//       expectedOutput: problem.expectedOutput,
//     });

//     const actualOutput = (judgeResult.stdout || "").trim();
//     const expectedOutput = String(problem.expectedOutput).trim();

//     const hasExecutionError =
//       judgeResult.stderr || judgeResult.compile_output;

//     const isAccepted =
//       !hasExecutionError &&
//       judgeResult.status === "Accepted" &&
//       actualOutput === expectedOutput;

//     const verdict = isAccepted ? "Accepted" : "Wrong Answer";
//     let rewardGiven = isAccepted ? problem.reward : 0;
//     if (rewardAlreadyClaimed) {
//   rewardGiven = 0;
// }
// let txHash = "";
// let rewardAlreadyClaimed = false;

// if (isAccepted) {
//   const previousAccepted = await Submission.findOne({
//     user: req.userId,
//     problem: problem._id,
//     verdict: "Accepted",
//     rewardGiven: { $gt: 0 },
//   });

//   if (previousAccepted) {
//     rewardAlreadyClaimed = true;
//   }

//   if (!rewardAlreadyClaimed) {
//     const user = await User.findById(req.userId);

//     if (!user.walletAddress) {
//       return res.status(400).json({
//         message: "Please connect MetaMask wallet before claiming reward.",
//       });
//     }

//     txHash = await transferCCT(user.walletAddress, problem.reward);

//     await User.findByIdAndUpdate(req.userId, {
//       $inc: {
//         tokens: problem.reward,
//         problemsSolved: 1,
//       },
//     });
//   }
// }

//     const submission = await Submission.create({
//       user: req.userId,
//       problem: problem._id,
//       code,
//       language,
//       verdict,
//       rewardGiven,
//       txHash,
//       output: actualOutput,
//     });

//     res.json({
//       message: isAccepted
//   ? rewardAlreadyClaimed
//     ? "Solution accepted again. Reward was already claimed for this problem."
//     : "Submission verified. CCT token transferred to your MetaMask wallet."
//   : hasExecutionError
//   ? judgeResult.stderr || judgeResult.compile_output
//   : "Your output did not match the expected output.",
//       verdict,
//       rewardGiven,
//       txHash,
//       output: actualOutput,
//       expectedOutput,
//       status: judgeResult.status,
//       time: judgeResult.time,
//       memory: judgeResult.memory,
//       submissionId: submission._id,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

// router.post("/submit", auth, async (req, res) => {
//   try {
//     const { problemId, code, language } = req.body;

//     const problem = await Problem.findById(problemId);

//     if (!problem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }

//     const judgeResult = await runCode({
//       code,
//       language,
//       stdin: "",
//       expectedOutput: problem.expectedOutput,
//     });

//     const actualOutput = (judgeResult.stdout || "").trim();
//     const expectedOutput = String(problem.expectedOutput).trim();

//     const hasExecutionError =
//       judgeResult.stderr || judgeResult.compile_output;

//     const isAccepted =
//       !hasExecutionError &&
//       judgeResult.status === "Accepted" &&
//       actualOutput === expectedOutput;

//     const verdict = isAccepted ? "Accepted" : "Wrong Answer";

//     let txHash = "";
//     let rewardGiven = 0;
//     let rewardAlreadyClaimed = false;

//     if (isAccepted) {
//       const previousAccepted = await Submission.findOne({
//         user: req.userId,
//         problem: problem._id,
//         verdict: "Accepted",
//         rewardGiven: { $gt: 0 },
//       });

//       if (previousAccepted) {
//         rewardAlreadyClaimed = true;
//       }

//       if (!rewardAlreadyClaimed) {
//         const user = await User.findById(req.userId);

//         if (!user.walletAddress) {
//           return res.status(400).json({
//             message: "Please connect MetaMask wallet before claiming reward.",
//           });
//         }

//         rewardGiven = problem.reward;
//         txHash = await transferCCT(user.walletAddress, rewardGiven);

//         await User.findByIdAndUpdate(req.userId, {
//           $inc: {
//             tokens: rewardGiven,
//             problemsSolved: 1,
//           },
//         });
//       }
//     }

//     const submission = await Submission.create({
//       user: req.userId,
//       problem: problem._id,
//       code,
//       language,
//       verdict,
//       rewardGiven,
//       txHash,
//       output: actualOutput,
//       status: judgeResult.status,
//       time: judgeResult.time,
//       memory: judgeResult.memory,
//     });

//     res.json({
//       message: isAccepted
//         ? rewardAlreadyClaimed
//           ? "Solution accepted again. Reward can be claimed only once for this problem."
//           : "Submission verified. CCT token transferred to your MetaMask wallet."
//         : hasExecutionError
//         ? judgeResult.stderr || judgeResult.compile_output
//         : "Your output did not match the expected output.",
//       verdict,
//       rewardGiven,
//       rewardAlreadyClaimed,
//       txHash,
//       output: actualOutput,
//       expectedOutput,
//       status: judgeResult.status,
//       time: judgeResult.time,
//       memory: judgeResult.memory,
//       submissionId: submission._id,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

router.post("/submit", auth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const testCases =
      problem.testCases && problem.testCases.length > 0
        ? problem.testCases
        : [
            {
              input: "",
              expectedOutput: problem.expectedOutput,
              isHidden: false,
            },
          ];

    let isAccepted = true;
    let failedCase = null;
    let lastJudgeResult = null;

    for (const testCase of testCases) {
      const judgeResult = await runCode({
        code,
        language,
        stdin: testCase.input || "",
        expectedOutput: testCase.expectedOutput,
      });

      lastJudgeResult = judgeResult;

      const actualOutput = (judgeResult.stdout || "").trim();
      const expectedOutput = String(testCase.expectedOutput).trim();

      const hasExecutionError =
        judgeResult.stderr || judgeResult.compile_output;

      const passed =
        !hasExecutionError &&
        judgeResult.status === "Accepted" &&
        actualOutput === expectedOutput;

      if (!passed) {
        isAccepted = false;

        failedCase = {
          input: testCase.isHidden ? "Hidden Test Case" : testCase.input,
          expectedOutput: testCase.isHidden
            ? "Hidden Expected Output"
            : expectedOutput,
          actualOutput,
          status: judgeResult.status,
          error: judgeResult.stderr || judgeResult.compile_output || "",
          isHidden: testCase.isHidden,
        };

        break;
      }
    }

    const verdict = isAccepted ? "Accepted" : "Wrong Answer";

    let txHash = "";
    let rewardGiven = 0;
    let rewardAlreadyClaimed = false;

    if (isAccepted) {
      const previousAccepted = await Submission.findOne({
        user: req.userId,
        problem: problem._id,
        verdict: "Accepted",
        rewardGiven: { $gt: 0 },
      });

      if (previousAccepted) {
        rewardAlreadyClaimed = true;
      }

      if (!rewardAlreadyClaimed) {
        const user = await User.findById(req.userId);

        if (!user.walletAddress) {
          return res.status(400).json({
            message: "Please connect MetaMask wallet before claiming reward.",
          });
        }

        rewardGiven = problem.reward;
        const xpEarned = problem.reward * 2;
const newXp = (user.xp || 0) + xpEarned;
const newLevel = calculateLevel(newXp);
        txHash = await transferCCT(user.walletAddress, rewardGiven);

       const today = new Date();

let newCurrentStreak = user.currentStreak || 0;
let newLongestStreak = user.longestStreak || 0;

if (!user.lastSolvedDate) {
  newCurrentStreak = 1;
} else {
  const lastSolvedDate = new Date(user.lastSolvedDate);

  if (isSameDay(lastSolvedDate, today)) {
    newCurrentStreak = user.currentStreak;
  } else if (isYesterday(lastSolvedDate, today)) {
    newCurrentStreak = user.currentStreak + 1;
  } else {
    newCurrentStreak = 1;
  }
}

newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);

await User.findByIdAndUpdate(req.userId, {
  $inc: {
    tokens: rewardGiven,
    problemsSolved: 1,
    xp: xpEarned,
  },
  $set: {
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastSolvedDate: today,
    level: newLevel,
  },
});
      }
    }

    const submission = await Submission.create({
      user: req.userId,
      problem: problem._id,
      code,
      language,
      verdict,
      rewardGiven,
      txHash,
      output: isAccepted
        ? "All test cases passed"
        : failedCase?.actualOutput || "",
      status: isAccepted
        ? "Accepted"
        : failedCase?.status || "Wrong Answer",
      time: lastJudgeResult?.time || "",
      memory: lastJudgeResult?.memory || "",
    });

    res.json({
      message: isAccepted
        ? rewardAlreadyClaimed
          ? "Solution accepted again. Reward can be claimed only once for this problem."
          : "Submission verified. CCT token transferred to your MetaMask wallet."
        : failedCase?.isHidden
        ? "Wrong Answer on a hidden test case."
        : failedCase?.error || "Your output did not match the expected output.",
      verdict,
      rewardGiven,
      rewardAlreadyClaimed,
      txHash,
      output: isAccepted
        ? "All test cases passed"
        : failedCase?.actualOutput || "",
      expectedOutput: failedCase?.isHidden
        ? "Hidden Expected Output"
        : failedCase?.expectedOutput || problem.expectedOutput,
      failedCase,
      status: isAccepted ? "Accepted" : failedCase?.status,
      time: lastJudgeResult?.time,
      memory: lastJudgeResult?.memory,
      submissionId: submission._id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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