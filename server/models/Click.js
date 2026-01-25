const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true, // Important for aggregation by date range
  },
  ip: {
    type: String,
    select: false, // Do not return by default for privacy
  },
  country: {
    type: String,
    default: "Unknown",
  },
  city: {
    type: String,
    default: "Unknown",
  },
  deviceType: {
    type: String, // mobile, tablet, desktop
    default: "desktop",
  },
  browser: {
    type: String,
    default: "Unknown",
  },
  os: {
    type: String,
    default: "Unknown",
  },
  referrer: {
    type: String,
    default: "Direct",
  },
});

const ClickModel = mongoose.model("Click", ClickSchema);

module.exports = ClickModel;
