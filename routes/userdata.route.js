const express = require("express");
const router = express.Router();
const { User } = require("../models/user.models");

router.route("/").get(async (req, res) => {
  try {
    const { userId } = req.user;
    const userDetails = await User.findById({ _id: userId })
      .populate("likedVideos")
      .populate("history")
      .populate("watchLater")
      .populate("playlist.list");
    const { likedVideos, history, watchLater, playlist, allNotes } =
      userDetails;
    res.json({
      success: true,
      likedVideos,
      history,
      watchLater,
      playlist,
      allNotes,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Liked Videos

router
  .route("/likedVideos/:id")
  .post(async (req, res) => {
    try {
      const { userId } = req.user;
      const videoId = req.params.id;
      const userDetails = await User.findById({ _id: userId });
      userDetails.likedVideos.push(videoId);
      await User.findByIdAndUpdate(
        { _id: userId },
        { likedVideos: userDetails.likedVideos }
      );
      res.json({ success: true, updatedList: userDetails.likedVideos });
    } catch (err) {
      console.log(err);
      res.json({ success: false, err: err.message });
    }
  })

  .delete(async (req, res) => {
    try {
      const { userId } = req.user;
      const videoId = req.params.id;
      const userDetails = await User.findById({ _id: userId });
      const updatedList = userDetails.likedVideos.filter((id) => id != videoId);
      await User.findByIdAndUpdate(
        { _id: userId },
        { likedVideos: updatedList }
      );
      res.json({ success: true, updatedList });
    } catch (err) {
      console.log(err);
    }
  });

// Watch Later

router
  .route("/watchLater/:id")
  .post(async (req, res) => {
    try {
      const { userId } = req.user;
      const videoId = req.params.id;
      const userDetails = await User.findById({ _id: userId });
      userDetails.watchLater.push(videoId);
      await User.findByIdAndUpdate(
        { _id: userId },
        { watchLater: userDetails.watchLater }
      );
      res.json({ success: true, updatedList: userDetails.watchLater });
    } catch (err) {
      console.log(err);
      res.json({ success: false, err: err.message });
    }
  })

  .delete(async (req, res) => {
    try {
      const { userId } = req.user;
      const videoId = req.params.id;
      const userDetails = await User.findById({ _id: userId });
      const updatedList = userDetails.watchLater.filter((id) => id != videoId);
      await User.findByIdAndUpdate(
        { _id: userId },
        { watchLater: updatedList }
      );
      res.json({ success: true, updatedList });
    } catch (err) {
      console.log(err);
    }
  });

// History

router
  .route("/history/:id")
  .post(async (req, res) => {
    try {
      const { userId } = req.user;
      const videoId = req.params.id;
      const userDetails = await User.findById({ _id: userId });
      const filterdList = userDetails.history.filter((id) => id != videoId);
      const updatedList = [...filterdList, videoId];
      await User.findByIdAndUpdate({ _id: userId }, { history: updatedList });

      res.json({ success: true, updatedList });
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: err.message });
    }
  })

  .delete(async (req, res) => {
    try {
      const { userId } = req.user;
      const videoId = req.params.id;
      const userDetails = await User.findById({ _id: userId });
      const updatedList = userDetails.history.filter((id) => id != videoId);
      await User.findByIdAndUpdate({ _id: userId }, { history: updatedList });
      res.json({ success: true, updatedList });
    } catch (err) {
      console.log(err);
    }
  });

// Playlist
router.route("/playlist").post(async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, _id } = req.body;
    const findUser = await User.findById({ _id: userId });
    const { playlist } = findUser;
    const findList = playlist.find((item) => item.name === name);
    let updatedList = [];
    if (findList) {
      findList.list.push(_id);
      updatedList = playlist.map((item) =>
        item.name === name ? (item = findList) : item
      );
    } else {
      playlist.push({ name, list: [_id] });
      updatedList = playlist;
    }
    await User.findByIdAndUpdate({ _id: userId }, { playlist: updatedList });
    res.json({ success: true, updatedList });
  } catch (err) {
    console.log(err);
  }
});

router.route("/playlist/remove").post(async (req, res) => {
  try {
    const { userId } = req.user;
    const { playlistId, videoId } = req.body;
    const findUser = await User.findById({ _id: userId });
    let filteredList = [];
    if (videoId) {
      const findPlaylist = findUser.playlist.find(
        (playlist) => playlist._id == playlistId
      );
      const updatedList = findPlaylist.list.filter((id) => id != videoId);
      filteredList = findUser.playlist.map((item) =>
        item._id == playlistId ? { ...item._doc, list: updatedList } : item
      );
    } else {
      filteredList = findUser.playlist.filter(
        (playlist) => playlist._id != playlistId
      );
    }
    await User.findByIdAndUpdate({ _id: userId }, { playlist: filteredList });
    res.json({ success: true, filteredList });
  } catch (err) {
    console.log(err);
  }
});

// Notes

router.route("/notes").post(async (req, res) => {
  const { userId } = req.user;
  const { videoId, noteToTake } = req.body;
  const findUser = await User.findById({ _id: userId });
  const { allNotes } = findUser;
  let findNotes = allNotes.find((item) => item._id == videoId);
  let updatedList = [];
  if (findNotes === undefined) {
    allNotes.push({ _id: videoId, notes: [noteToTake] });
    updatedList = allNotes;
  } else {
    findNotes.notes.push(noteToTake);
    updatedList = allNotes.map((item) =>
      item._id == videoId ? (item = findNotes) : item
    );
  }

  await User.findByIdAndUpdate({ _id: userId }, { allNotes: updatedList });
  res.json({ success: true, newNotes: updatedList });
});

module.exports = router;
