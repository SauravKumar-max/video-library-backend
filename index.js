const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 3030;

const { initializeDBConnection } = require("./db/db.connect");
const pageNotFound = require("./middleware/pageNotFound");
const internalSeverError = require("./middleware/internalServerError");
const authVerify = require("./middleware/authVerify");
const videoRouter = require("./routes/videos.route");
const userRouter = require("./routes/users.route");
const userdataRouter = require("./routes/userdata.route");

const app = express();

app.use(cors());
app.use(bodyParser.json());

initializeDBConnection();

app.get("/", (req, res) => {
  res.send("Video Library API");
});

app.use("/videos", videoRouter);
app.use("/user", userRouter);
app.use("/userdata", authVerify, userdataRouter);

// ** Note: DO NOT MOVE (This should be last Route) **

// 404 error route Handler
app.use(pageNotFound);

// 500 server error handler
app.use(internalSeverError);

app.listen(port, () => {
  console.log("server started");
});
