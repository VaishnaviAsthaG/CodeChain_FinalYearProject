const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"CodeChain" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "CodeChain Password Reset OTP",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>CodeChain Password Reset</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  });
};

module.exports = sendOtpEmail;