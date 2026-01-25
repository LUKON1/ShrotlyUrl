const mongoose = require("mongoose");

const DailyStatsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true,
    index: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    index: true,
  },
  totalClicks: {
    type: Number,
    default: 0,
  },
  countries: {
    type: Map,
    of: Number, // "US": 10, "RU": 5
    default: {},
  },
  cities: {
    type: Map,
    of: Number,
    default: {},
  },
  deviceTypes: {
    type: Map,
    of: Number, // "mobile": 5, "desktop": 10
    default: {},
  },
  browsers: {
    type: Map,
    of: Number,
    default: {},
  },
  os: {
    type: Map,
    of: Number,
    default: {},
  },
  referrers: {
    type: Map,
    of: Number,
    default: {},
  },
});

// Index to efficiently query stats for a specific URL and date range
DailyStatsSchema.index({ urlId: 1, date: 1 }, { unique: true });

const DailyStatsModel = mongoose.model("DailyStats", DailyStatsSchema);

module.exports = DailyStatsModel;
