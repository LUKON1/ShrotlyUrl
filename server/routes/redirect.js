const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");

const requestIp = require("request-ip");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");
const ClickModel = require("../models/Click");

router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (shortCode.length !== 7) {
      return res.status(404).send("Not found");
    }

    const urlEntry = await UrlModel.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true } // Return the updated document
    );

    if (!urlEntry) {
      return res.status(404).send("Short URL not found.");
    }

    if (urlEntry.isActive === false) {
      return res.redirect(302, `${process.env.HOST_NAME}/pau`);
    }

    if (new Date(urlEntry.expiredAt) < new Date()) {
      return res.redirect(302, `${process.env.HOST_NAME}/exp`);
    }

    // Fire-and-forget analytics logging
    (async () => {
      try {
        const ip = requestIp.getClientIp(req);
        const geo = geoip.lookup(ip) || {};
        const ua = UAParser(req.headers["user-agent"]);
        const referrer = req.headers["referer"] || "Direct";

        // Simplify referrer
        let simplifiedReferrer = "Direct";
        if (referrer !== "Direct") {
          try {
            const refUrl = new URL(referrer);
            simplifiedReferrer = refUrl.hostname;
          } catch (e) {
            simplifiedReferrer = referrer;
          }
        }

        const newClick = new ClickModel({
          urlId: urlEntry._id,
          ip: ip,
          country: geo.country || "Unknown",
          city: geo.city || "Unknown",
          deviceType: ua.device.type || "desktop", // default to desktop if undefined
          browser: ua.browser.name || "Unknown",
          os: ua.os.name || "Unknown",
          referrer: simplifiedReferrer,
        });

        await newClick.save();
      } catch (logErr) {
        console.error("Analytics logging failed:", logErr);
      }
    })();

    return res.redirect(302, urlEntry.url);
  } catch (err) {
    console.error("Error during short URL redirect:", err);
    res.status(500).send("Server error during redirect.");
  }
});

module.exports = router;
