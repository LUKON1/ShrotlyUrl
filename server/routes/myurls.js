const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");

router.get("/geturls", async (req, res) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(401).json({ error: "User not authenticated" });
		}
		const userUrls = (await UrlModel.find({ userId: userId })).toSorted({
			createdAt: -1,
		});

		res.status(200).json(userUrls);
	} catch (err) {
		console.error("Error in /geturls route:", err);
		res.status(500).json({ error: "Server error", details: err.message });
	}
});
module.exports = router;
