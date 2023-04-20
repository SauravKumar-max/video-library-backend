const express = require("express");
const router = express.Router();
const { User } = require("../models/user.models");
const authVerify = require("../middleware/authVerify");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mySecret = process.env["SECRET"];
const jwt = require("jsonwebtoken");

router
  .route("/")
  .get(authVerify, async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);
      res.json({ success: true, username: user.username, email: user.email });
    } catch (err) {
      res.json({ message: err.message });
    }
  })

  .post(async (req, res) => {
    try {
      let newUser = req.body;
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(newUser.password, salt, async function (err, hash) {
          newUser = { ...newUser, password: hash };
          const AddUser = new User(newUser);
          const saveUser = await AddUser.save();
          res.json({ success: true, saveUser });
        });
      });
    } catch (err) {
      console.log(err);
      res.json({ message: err.message });
    }
  });

router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body.user;
    const users = await User.find();
    const userInfo = users.find((user) => user.email === email);
    if (userInfo) {
      bcrypt.compare(password, userInfo.password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userId: userInfo._id }, mySecret, {
            expiresIn: "72h",
          });
          return res.json({ email, token });
        }
        return res
          .status(403)
          .json({ success: false, message: "incorrect password", err });
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "user not found please SignUp!" });
    }
  } catch (err) {
    res.json({ err, message: err.message });
  }
});

module.exports = router;
