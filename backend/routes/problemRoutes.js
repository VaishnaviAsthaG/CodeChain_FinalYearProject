// const express = require("express");
// const Problem = require("../models/Problem");

// const router = express.Router();

// // ADD SAMPLE PROBLEMS - keep this BEFORE /:id
// router.get("/seed", async (req, res) => {
//   try {
//     await Problem.deleteMany();

//     const sampleProblems = [
//       {
//         title: "Two Sum",
//         description:
//           "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
//         difficulty: "Easy",
//         inputExample: "nums = [2,7,11,15], target = 9",
//         outputExample: "[0,1]",
//         expectedOutput: "[0,1]",
//         reward: 50,
//       },
//       {
//         title: "Longest Substring Without Repeating Characters",
//         description:
//           "Find the length of the longest substring without repeating characters.",
//         difficulty: "Medium",
//         inputExample: 's = "abcabcbb"',
//         outputExample: "3",
//         expectedOutput: "3",
//         reward: 120,
//       },
//       {
//         title: "Merge K Sorted Lists",
//         description: "Merge all linked lists into one sorted linked list.",
//         difficulty: "Hard",
//         inputExample: "[1,4,5],[1,3,4],[2,6]",
//         outputExample: "[1,1,2,3,4,4,5,6]",
//         expectedOutput: "[1,1,2,3,4,4,5,6]",
//         reward: 300,
//       },
//     ];

//     // ADD NEW PROBLEM
// router.post("/add", async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       difficulty,
//       inputExample,
//       outputExample,
//       expectedOutput,
//       reward,
//     } = req.body;

//     const problem = await Problem.create({
//       title,
//       description,
//       difficulty,
//       inputExample,
//       outputExample,
//       expectedOutput,
//       reward,
//     });

//     res.status(201).json({
//       message: "Problem added successfully",
//       problem,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

//     const insertedProblems = await Problem.insertMany(sampleProblems);

//     res.json({
//       message: "Problems seeded successfully",
//       insertedProblems,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET ALL PROBLEMS
// router.get("/", async (req, res) => {
//   try {
//     const problems = await Problem.find();
//     res.json(problems);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET SINGLE PROBLEM
// router.get("/:id", async (req, res) => {
//   try {
//     const problem = await Problem.findById(req.params.id);

//     if (!problem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }

//     res.json(problem);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const Problem = require("../models/Problem");

const router = express.Router();

// ADD SAMPLE PROBLEMS - keep this BEFORE /:id
router.get("/seed", async (req, res) => {
  try {
    await Problem.deleteMany();

    const sampleProblems = [
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "Easy",
        inputExample: "nums = [2,7,11,15], target = 9",
        outputExample: "[0,1]",
        expectedOutput: "[0,1]",
        reward: 50,
      },
      {
        title: "Longest Substring Without Repeating Characters",
        description:
          "Find the length of the longest substring without repeating characters.",
        difficulty: "Medium",
        inputExample: 's = "abcabcbb"',
        outputExample: "3",
        expectedOutput: "3",
        reward: 120,
      },
      {
        title: "Merge K Sorted Lists",
        description: "Merge all linked lists into one sorted linked list.",
        difficulty: "Hard",
        inputExample: "[1,4,5],[1,3,4],[2,6]",
        outputExample: "[1,1,2,3,4,4,5,6]",
        expectedOutput: "[1,1,2,3,4,4,5,6]",
        reward: 300,
      },
    ];

    const insertedProblems = await Problem.insertMany(sampleProblems);

    res.json({
      message: "Problems seeded successfully",
      insertedProblems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD NEW PROBLEM
router.post("/add", async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      inputExample,
      outputExample,
      expectedOutput,
      reward,
    } = req.body;

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      inputExample,
      outputExample,
      expectedOutput,
      reward: Number(reward),
    });

    res.status(201).json({
      message: "Problem added successfully",
      problem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL PROBLEMS
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE PROBLEM - keep this LAST
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;