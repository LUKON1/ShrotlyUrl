require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");

const urlShorterRouter = require("./routes/cut");
const getUsUrlsRouter = require("./routes/myurls");
const userRouter = require("./routes/user");
const shareRouter = require("./routes/share");
const auth = require("./middleware/auth");
const redirectRouter = require("./routes/redirect");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const HOST_NAME = process.env.HOST_NAME;

app.use(helmet());

app.use(
  cors({
    origin: HOST_NAME,
    methods: ["POST", "GET", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookie());

const apiLimiter = require("./middleware/rateLimiter");
// Stricter limit for auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later." },
});

app.use("/api/cut", apiLimiter, urlShorterRouter);
app.use("/api/myurls", auth, getUsUrlsRouter);
app.use("/api/user", authLimiter, userRouter);
app.use("/api/share", shareRouter);

app.use("/", redirectRouter);

const startAggregation = require("./cron/aggregateStats");
const startCleanupJob = require("./cron/cleanupExpiredUrls");

startAggregation();
startCleanupJob();

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("mongo db connected");
  })
  .catch((err) => {
    console.error(`mongo db connected with error:${err.message}`);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Shortly url server is started on port:${PORT}`);
});
