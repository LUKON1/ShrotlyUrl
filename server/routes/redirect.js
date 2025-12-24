const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");

router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    const urlEntry = await UrlModel.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).send("Short URL not found.");
    }

    if (urlEntry.isActive === false) {
      return res.redirect(302, `${process.env.HOST_NAME}/paused`);
    }

    if (new Date(urlEntry.expiredAt) < new Date()) {
      return res.status(410).send("Short URL has expired.");
    }

    urlEntry.clicks++;
    await urlEntry.save();

    return res.redirect(302, urlEntry.url);
  } catch (err) {
    console.error("Error during short URL redirect:", err);
    res.status(500).send("Server error during redirect.");
  }
});

module.exports = router;
