const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CodeChain Backend is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/problems", require("./routes/problemRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});