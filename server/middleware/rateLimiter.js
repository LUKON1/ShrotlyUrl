const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // Limit each IP to 5 requests per window (EDIT HERE TO CHANGE LIMIT)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: "Daily limit reached. You can create up to 5 links per day.",
  },
});

module.exports = apiLimiter;
