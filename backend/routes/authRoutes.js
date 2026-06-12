const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOtpEmail = require("../services/emailService");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
  return res.status(400).json({
    message: "Name, email and password are required",
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Please enter a valid email address",
  });
}

if (password.length < 6) {
  return res.status(400).json({
    message: "Password must be at least 6 characters long",
  });
}

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



// LOGIN
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) {
  return res.status(400).json({
    message: "Email and password are required",
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Please enter a valid email address",
  });
}

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

// GOOGLE LOGIN
router.post("/google-login", async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Google account email is required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email,
        password: "GOOGLE_AUTH_USER",
        photoURL: photoURL || "",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET PROFILE
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// CONNECT WALLET
router.put("/connect-wallet", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { walletAddress } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { walletAddress },
      { new: true }
    ).select("-password");

    res.json({
      message: "Wallet connected successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// SEND RESET OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password request received:", email);
console.log("User found");
console.log("OTP saved");
console.log("Sending email...");
await sendOtpEmail(email, otp);
console.log("Email sent");

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendOtpEmail(email, otp);

    res.json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// RESET PASSWORD USING OTP
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (!user.resetOtpExpiry || user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpiry = null;

    await user.save();

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;