const mongoose = require("mongoose");
const { Schema } = mongoose;
require("mongoose-type-url");

const VideoSchema = new mongoose.Schema(
  {
    _id: Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    channelName: { type: String, required: true },
    channelImage: { type: mongoose.SchemaTypes.Url, required: true },
    videoUrl: { type: mongoose.SchemaTypes.Url, required: true },
    thumbnail: { type: mongoose.SchemaTypes.Url, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", VideoSchema);

module.exports = { Video };
