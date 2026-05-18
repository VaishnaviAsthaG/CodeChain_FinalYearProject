const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    inputExample: {
      type: String,
      required: true,
    },
    outputExample: {
      type: String,
      required: true,
    },
    expectedOutput: {
      type: String,
      required: true,
    },
    reward: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);