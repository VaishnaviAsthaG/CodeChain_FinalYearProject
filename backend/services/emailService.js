const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"CodeChain" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your CodeChain verification code",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>✦ CodeChain</h2>
        <p>You requested a password reset for your CodeChain account.</p>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If this wasn’t you, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = sendOtpEmail;