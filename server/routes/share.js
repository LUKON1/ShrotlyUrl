const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");

router.get("/:shareId", async (req, res) => {
  try {
    const { shareId } = req.params;

    // Validate ObjectId format
    if (!shareId || !shareId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid share ID format" });
    }

    const urlEntry = await UrlModel.findById(shareId);

    if (!urlEntry) {
      return res.status(404).json({ error: "Short URL not found." });
    }

    // 1. Get Historical Data (DailyStats)
    const DailyStatsModel = require("../models/DailyStats"); // Lazy load
    const dailyStats = await DailyStatsModel.find({ urlId: urlEntry._id }).sort({ date: 1 });

    // 2. Get Real-time Data (Clicks for today)
    const ClickModel = require("../models/Click"); // Lazy load
    const today = new Date().toISOString().split("T")[0];
    const startOfDay = new Date(today);
    const todayClicks = await ClickModel.find({
      urlId: urlEntry._id,
      timestamp: { $gte: startOfDay },
    });

    // 3. Aggregate Data
    const chartData = [];
    const devices = {};
    const browsers = {};
    const countries = {};
    const os = {};

    // Helper to sum up stats
    const addToMap = (map, key, count = 1) => {
      map[key] = (map[key] || 0) + count;
    };

    // Process Historical
    dailyStats.forEach((stat) => {
      chartData.push({ date: stat.date, clicks: stat.totalClicks });

      if (stat.deviceTypes) stat.deviceTypes.forEach((v, k) => addToMap(devices, k, v));
      if (stat.browsers) stat.browsers.forEach((v, k) => addToMap(browsers, k, v));
      if (stat.countries) stat.countries.forEach((v, k) => addToMap(countries, k, v));
      if (stat.os) stat.os.forEach((v, k) => addToMap(os, k, v));
    });

    // Process Today (Real-time)
    const todayStats = { date: today, clicks: todayClicks.length };
    // Check if today is already in chartData (unlikely if cron runs at night, but good for safety)
    const existingToday = chartData.find((d) => d.date === today);
    if (existingToday) {
      existingToday.clicks += todayStats.clicks;
    } else {
      chartData.push(todayStats);
    }

    todayClicks.forEach((click) => {
      addToMap(devices, click.deviceType);
      addToMap(browsers, click.browser);
      addToMap(countries, click.country);
      addToMap(os, click.os);
    });

    // Sort chart data by date
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Fill missing dates with 0 from the earliest date to today
    const filledChartData = [];
    if (chartData.length > 0) {
      const earliestDate = new Date(chartData[0].date);
      const todayDate = new Date();

      // Reset time parts to ensure correct day calculation
      earliestDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);

      for (let d = new Date(earliestDate); d <= todayDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split("T")[0];
        const existing = chartData.find((item) => item.date === dateString);
        if (existing) {
          filledChartData.push(existing);
        } else {
          filledChartData.push({ date: dateString, clicks: 0 });
        }
      }
    } else {
      // Fallback: If no data at all, return last 7 days with 0
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        filledChartData.push({ date: d, clicks: 0 });
      }
    }

    const publicData = {
      url: urlEntry.url,
      shortCode: urlEntry.shortCode,
      createdAt: urlEntry.createdAt,
      expiredAt: urlEntry.expiredAt,
      clicks: urlEntry.clicks,
      qrCodeDataUrl: urlEntry.qrCodeDataUrl,
      isExpired: new Date(urlEntry.expiredAt) < new Date(),
      chartData: filledChartData,
      devices,
      browsers,
      countries,
      os,
    };

    res.status(200).json(publicData);
  } catch (err) {
    console.error("Error in /share/:shortCode route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
