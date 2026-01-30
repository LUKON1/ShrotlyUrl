const rateLimit = require("express-rate-limit");

const regLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // Limit each IP to 5 registrations per day (EDIT HERE TO CHANGE LIMIT)
  message: {
    error: "Too many accounts created from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = regLimiter;
