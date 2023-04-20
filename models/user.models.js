const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: [true, "username already exists!"],
    },

    email: {
      type: String,
      required: true,
      unique: [true, "email already exists, please login!"],
    },

    password: {
      type: String,
      required: true,
    },

    watchLater: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    likedVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    history: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    playlist: [
      {
        name: {
          type: String,
          required: true,
        },
        list: [
          {
            type: Schema.Types.ObjectId,
            ref: "Video",
          },
        ],
      },
    ],

    allNotes: [
      {
        _id: Schema.Types.ObjectId,
        notes: [String],
      },
    ],
  },
  { timestamps: true },
  { autoIndex: false }
);

const User = mongoose.model("User", UserSchema);

module.exports = { User };
