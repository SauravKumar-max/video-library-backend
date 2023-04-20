const express = require("express");
const router = express.Router();
const videoData = require("../db/data");
const { Video } = require("../models/videos.models");

router.route("/").get(async (req, res) => {
  try {
    // const videos = await Video.insertMany(videoData);
    const videos = await Video.find();
    res.json({ success: true, videos });
  } catch (err) {
    console.log(err);
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById({ _id: videoId });
    res.json({ success: true, video });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
