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

      // 2. Optimized Aggregation Pipeline
      const aggregationResults = await ClickModel.aggregate([
        {
          $match: {
            timestamp: { $gte: startOfYesterday, $lte: endOfYesterday },
          },
        },
        {
          $facet: {
            // Group by URL to get total clicks
            totalClicks: [
              {
                $group: {
                  _id: "$urlId",
                  count: { $sum: 1 },
                },
              },
            ],
            // Group by each dimension to count occurrences
            byCountry: [
              {
                $group: {
                  _id: { urlId: "$urlId", value: "$country" },
                  count: { $sum: 1 },
                },
              },
            ],
            byCity: [
              {
                $group: {
                  _id: { urlId: "$urlId", value: "$city" },
                  count: { $sum: 1 },
                },
              },
            ],
            byDeviceType: [
              {
                $group: {
                  _id: { urlId: "$urlId", value: "$deviceType" },
                  count: { $sum: 1 },
                },
              },
            ],
            byBrowser: [
              {
                $group: {
                  _id: { urlId: "$urlId", value: "$browser" },
                  count: { $sum: 1 },
                },
              },
            ],
            byOs: [
              {
                $group: {
                  _id: { urlId: "$urlId", value: "$os" },
                  count: { $sum: 1 },
                },
              },
            ],
            byReferrer: [
              {
                $group: {
                  _id: { urlId: "$urlId", value: "$referrer" },
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]);

      // 3. Process facet results (Transform into DailyStats format)
      // The facet result is an array with one object containing all arrays
      const facets = aggregationResults[0];

      // Helper to transform facet array into nested object map: { urlId: { "value": count } }
      const transformFacet = (facetArray) => {
        const result = {};
        facetArray.forEach((item) => {
          const urlId = item._id.urlId.toString();
          const value = item._id.value;
          const count = item.count;

          if (!result[urlId]) result[urlId] = {};
          result[urlId][value] = count;
        });
        return result;
      };

      const clicksMap = {};
      facets.totalClicks.forEach((item) => {
        clicksMap[item._id.toString()] = item.count;
      });

      const countriesMap = transformFacet(facets.byCountry);
      const citiesMap = transformFacet(facets.byCity);
      const deviceTypesMap = transformFacet(facets.byDeviceType);
      const browsersMap = transformFacet(facets.byBrowser);
      const osMap = transformFacet(facets.byOs);
      const referrersMap = transformFacet(facets.byReferrer);

      // Get all unique URL IDs from totalClicks
      const processedUrlIds = Object.keys(clicksMap);

      for (const urlId of processedUrlIds) {
        const statsData = {
          urlId: urlId,
          date: dateKey,
          totalClicks: clicksMap[urlId] || 0,
          countries: countriesMap[urlId] || {},
          cities: citiesMap[urlId] || {},
          deviceTypes: deviceTypesMap[urlId] || {},
          browsers: browsersMap[urlId] || {},
          os: osMap[urlId] || {},
          referrers: referrersMap[urlId] || {},
        };

        // 4. Save to DailyStats
        await DailyStatsModel.updateOne(
          { urlId: urlId, date: dateKey },
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
