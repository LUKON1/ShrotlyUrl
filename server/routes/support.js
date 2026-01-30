const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const https = require("https"); // Use native node https to avoid dependency issues

const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 reports per hour
  message: { error: "Too many reports submitted used from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/report", reportLimiter, async (req, res) => {
  try {
    const { topic, description, contact } = req.body;

    if (!topic || !description) {
      return res.status(400).json({ error: "Topic and description are required." });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not defined in .env");
      return res.status(200).json({ message: "Report received (simulation mode)." });
    }

    // Construct Discord Embed
    const payload = JSON.stringify({
      username: "ShortlyURL Bug Bot",
      avatar_url: "https://i.imgur.com/4M34hi2.png",
      embeds: [
        {
          title: `🐛 New Bug Report: ${topic}`,
          color: 15158332, // Red
          fields: [
            {
              name: "Description",
              value: description.substring(0, 1024), // Discord limit
            },
            {
              name: "Contact Info",
              value: contact || "Anonymous",
              inline: true,
            },
            {
              name: "IP Address",
              value: req.ip || "Unknown",
              inline: true,
            },
          ],
          footer: {
            text: "ShortlyURL Support System",
            icon_url: "https://i.imgur.com/4M34hi2.png",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    });

    const url = new URL(webhookUrl);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const request = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(200).json({ message: "Report sent successfully." });
        } else {
          console.error(`Discord API error: ${response.statusCode} - ${data}`);
          res.status(500).json({ error: "Failed to send report to external service." });
        }
      });
    });

    request.on("error", (error) => {
      console.error("Network error sending report:", error);
      res.status(500).json({ error: "Network error sending report." });
    });

    request.write(payload);
    request.end();
  } catch (error) {
    console.error("Error processing report:", error);
    res.status(500).json({ error: "Failed to process report." });
  }
});

module.exports = router;
