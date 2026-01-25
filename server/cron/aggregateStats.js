const cron = require("node-cron");
const ClickModel = require("../models/Click");
const DailyStatsModel = require("../models/DailyStats");
const UrlModel = require("../models/Url");

// Run at 03:00 AM every day
const startAggregation = () => {
  cron.schedule("0 3 * * *", async () => {
    console.log("Running daily analytics aggregation...");

    try {
      // 1. Define timespan (Yesterday)
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
      const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));
      const dateKey = startOfYesterday.toISOString().split("T")[0]; // YYYY-MM-DD

      // 2. Find all clicks for yesterday
      // Using aggregate to group efficiently in DB
      const aggregationResults = await ClickModel.aggregate([
        {
          $match: {
            timestamp: { $gte: startOfYesterday, $lte: endOfYesterday },
          },
        },
        {
          $group: {
            _id: "$urlId",
            totalClicks: { $sum: 1 },
            countries: { $push: "$country" },
            cities: { $push: "$city" },
            deviceTypes: { $push: "$deviceType" },
            browsers: { $push: "$browser" },
            os: { $push: "$os" },
            referrers: { $push: "$referrer" },
          },
        },
      ]);

      // 3. Process each URL group
      for (const group of aggregationResults) {
        // Helper to count frequencies
        const countFreq = (arr) => {
          return arr.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
          }, {});
        };

        const statsData = {
          urlId: group._id,
          date: dateKey,
          totalClicks: group.totalClicks,
          countries: countFreq(group.countries),
          cities: countFreq(group.cities),
          deviceTypes: countFreq(group.deviceTypes),
          browsers: countFreq(group.browsers),
          os: countFreq(group.os),
          referrers: countFreq(group.referrers),
        };

        // 4. Save to DailyStats (Upsert = Update or Insert)
        await DailyStatsModel.updateOne(
          { urlId: group._id, date: dateKey },
          { $set: statsData },
          { upsert: true }
        );
      }

      // 5. Cleanup raw clicks (ONLY if successfully aggregated)
      // Safety check: Only delete if aggregation ran (results exist or verified)
      // For now, we delete strictly what we processed
      if (aggregationResults.length > 0) {
        await ClickModel.deleteMany({
          timestamp: { $gte: startOfYesterday, $lte: endOfYesterday },
        });
        console.log("Aggregation complete.");
      } else {
        console.log("No clicks to aggregate for yesterday.");
      }
    } catch (err) {
      console.error("Aggregation failed:", err);
    }
  });
};

module.exports = startAggregation;
