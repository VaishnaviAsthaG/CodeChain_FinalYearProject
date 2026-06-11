const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},
    walletAddress: {
      type: String,
      default: "",
    },
    tokens: {
      type: Number,
      default: 0,
    },
    problemsSolved: {
      type: Number,
      default: 0,
    },
currentStreak: {
  type: Number,
  default: 0,
},

longestStreak: {
  type: Number,
  default: 0,
},

lastSolvedDate: {
  type: Date,
  default: null,
},

xp: {
  type: Number,
  default: 0,
},

level: {
  type: Number,
  default: 1,
},

photoURL: {
  type: String,
  default: "",
},

resetOtp: {
  type: String,
  default: "",
},

resetOtpExpiry: {
  type: Date,
  default: null,
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);