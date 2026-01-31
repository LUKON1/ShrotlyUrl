const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");
const UserModel = require("../models/User");

router.get("/geturls", async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userUrls = await UrlModel.find({ userId: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(userUrls);
  } catch (err) {
    console.error("Error in /geturls route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userUrls = await UrlModel.find({ userId: userId });
    const userUrlIds = userUrls.map((u) => u._id);

    // Basic Stats
    const totalUrls = userUrls.length;
    const totalClicks = userUrls.reduce((sum, url) => sum + url.clicks, 0);
    const activeUrls = userUrls.filter((url) => new Date(url.expiredAt) > new Date()).length;
    const expiredUrls = totalUrls - activeUrls;

    // Advanced Stats Aggregation
    const DailyStatsModel = require("../models/DailyStats");
    const ClickModel = require("../models/Click");

    const chartData = {}; // date -> { created: 0, clicks: 0 }
    const devices = {};
    const browsers = {};
    const countries = {};
    const referrers = {};

    const addToMap = (map, key, count = 1) => {
      if (!key) return;
      map[key] = (map[key] || 0) + count;
    };

    // 1. Process Historical Data
    const dailyStats = await DailyStatsModel.find({ urlId: { $in: userUrlIds } });

    dailyStats.forEach((stat) => {
      // Chart Data
      if (!chartData[stat.date]) chartData[stat.date] = { created: 0, clicks: 0 };
      chartData[stat.date].clicks += stat.totalClicks;

      // Distribution Data
      if (stat.deviceTypes) stat.deviceTypes.forEach((v, k) => addToMap(devices, k, v));
      if (stat.browsers) stat.browsers.forEach((v, k) => addToMap(browsers, k, v));
      if (stat.countries) stat.countries.forEach((v, k) => addToMap(countries, k, v));
      if (stat.referrers) stat.referrers.forEach((v, k) => addToMap(referrers, k, v));
    });

    // 2. Process Today's Data
    const today = new Date().toISOString().split("T")[0];
    const startOfDay = new Date(today);
    const todayClicks = await ClickModel.find({
      urlId: { $in: userUrlIds },
      timestamp: { $gte: startOfDay },
    });

    if (!chartData[today]) chartData[today] = { created: 0, clicks: 0 };
    chartData[today].clicks += todayClicks.length;

    todayClicks.forEach((click) => {
      addToMap(devices, click.deviceType);
      addToMap(browsers, click.browser);
      addToMap(countries, click.country);
      addToMap(referrers, click.referrer);
    });

    // 3. Process Created By Day (From UrlModel)
    userUrls.forEach((url) => {
      const createdDate = new Date(url.createdAt).toISOString().split("T")[0];
      if (!chartData[createdDate]) chartData[createdDate] = { created: 0, clicks: 0 };
      chartData[createdDate].created += 1;
    });

    // 4. Format Chart Data Array
    const chartDataArray = Object.keys(chartData)
      .sort()
      .map((date) => ({
        date,
        created: chartData[date].created,
        clicks: chartData[date].clicks,
      }));

    // Fill last 30 days if empty
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      if (!chartData[d]) {
        chartData[d] = { created: 0, clicks: 0 };
      }
    }

    // Calculate Last 7 and 30 Days Clicks based on aggregated data
    const last7DaysDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const last30DaysDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const clicksLast7Days = chartDataArray
      .filter((d) => d.date >= last7DaysDate)
      .reduce((sum, d) => sum + d.clicks, 0);

    const clicksLast30Days = chartDataArray
      .filter((d) => d.date >= last30DaysDate)
      .reduce((sum, d) => sum + d.clicks, 0);

    const topUrls = userUrls
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map((url) => ({
        shortCode: url.shortCode,
        url: url.url,
        clicks: url.clicks,
      }));

    res.status(200).json({
      totalUrls,
      totalClicks,
      activeUrls,
      expiredUrls,
      clicksLast7Days,
      clicksLast30Days,
      topUrls,
      chartData: chartDataArray,
      devices,
      browsers,
      countries,
      referrers,
    });
  } catch (err) {
    console.error("Error in /analytics route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.get("/analytics/:urlId", async (req, res) => {
  try {
    const userId = req.userId;
    const { urlId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const urlEntry = await UrlModel.findOne({ _id: urlId, userId: userId });

    if (!urlEntry) {
      return res.status(404).json({ error: "URL not found or access denied" });
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
    const referrers = {};

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
      if (stat.referrers) stat.referrers.forEach((v, k) => addToMap(referrers, k, v));
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
      addToMap(referrers, click.referrer);
    });

    // Sort chart data by date
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Fill missing dates with 0 for the last 7 days to make the chart look nice
    const filledChartData = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const existing = chartData.find((item) => item.date === d);
      if (existing) {
        filledChartData.push(existing);
      } else {
        filledChartData.push({ date: d, clicks: 0 });
      }
    }

    res.status(200).json({
      urlId: urlEntry._id,
      shortCode: urlEntry.shortCode,
      url: urlEntry.url,
      totalClicks: urlEntry.clicks, // Use the master counter from UrlModel
      createdAt: urlEntry.createdAt,
      expiredAt: urlEntry.expiredAt,
      chartData: filledChartData,
      devices,
      browsers,
      countries,
      referrers,
    });
  } catch (err) {
    console.error("Error in /analytics/:urlId route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await UserModel.findById(userId).select("-pwd -refreshToken");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userUrls = await UrlModel.find({ userId: userId });
    const totalClicks = userUrls.reduce((sum, url) => sum + url.clicks, 0);
    const accountCreated = user._id.getTimestamp();

    res.status(200).json({
      username: user.user,
      totalUrls: userUrls.length,
      totalClicks: totalClicks,
      accountCreated: accountCreated,
    });
  } catch (err) {
    console.error("Error in /profile route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.patch("/toggle/:urlId", async (req, res) => {
  try {
    const userId = req.userId;
    const { urlId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const urlEntry = await UrlModel.findOne({ _id: urlId, userId: userId });

    if (!urlEntry) {
      return res.status(404).json({ error: "URL not found or access denied" });
    }

    urlEntry.isActive = !urlEntry.isActive;
    await urlEntry.save();

    res.status(200).json(urlEntry);
  } catch (err) {
    console.error("Error in /toggle/:urlId route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.patch("/update-title/:urlId", async (req, res) => {
  try {
    const userId = req.userId;
    const { urlId } = req.params;
    const { title } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (title !== null && title !== undefined && title.length > 24) {
      return res.status(400).json({ error: "Title too long (max 24 characters)" });
    }

    const urlEntry = await UrlModel.findOne({ _id: urlId, userId: userId });

    if (!urlEntry) {
      return res.status(404).json({ error: "URL not found or access denied" });
    }

    urlEntry.title = title || null;
    await urlEntry.save();

    res.status(200).json(urlEntry);
  } catch (err) {
    console.error("Error in PATCH /update-title/:urlId route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.patch("/update-url/:urlId", async (req, res) => {
  try {
    const userId = req.userId;
    const { urlId } = req.params;
    const { url } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!url || !url.trim()) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Check if URL contains the project's domain (similar to creation validation)
    const containsMyDomain = (testUrl) => {
      const MyDomainHost = process.env.HOST_NAME.replace(/^https?:\/\//, "");
      const MyDomainName = MyDomainHost.split(":")[0]; // Remove port if present
      const banedDomains = [MyDomainName, MyDomainHost];
      const regexp = new RegExp(`^(https?:\/\/)?(www\.)?(${banedDomains.join("|")})(\/|$)`, "i");
      return regexp.test(testUrl);
    };

    if (containsMyDomain(url)) {
      return res.status(400).json({ error: "URL cannot contain the project's domain" });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (urlErr) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const urlEntry = await UrlModel.findOne({ _id: urlId, userId: userId });

    if (!urlEntry) {
      return res.status(404).json({ error: "URL not found or access denied" });
    }

    urlEntry.url = url.trim();
    await urlEntry.save();

    res.status(200).json(urlEntry);
  } catch (err) {
    console.error("Error in PATCH /update-url/:urlId route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.delete("/:urlId", async (req, res) => {
  try {
    const userId = req.userId;
    const { urlId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const urlEntry = await UrlModel.findOne({ _id: urlId, userId: userId });

    if (!urlEntry) {
      return res.status(404).json({ error: "URL not found or access denied" });
    }

    await UrlModel.findByIdAndDelete(urlId);

    res.status(200).json({ message: "URL deleted successfully" });
  } catch (err) {
    console.error("Error in DELETE /:urlId route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
