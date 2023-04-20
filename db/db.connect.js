const mongoose = require("mongoose");

async function initializeDBConnection() {
  const mySecret = process.env["MONGODB_AUTH"];
  try {
    const uri = `mongodb+srv://${mySecret}@cluster0.iha7u.mongodb.net/video-library?retryWrites=true&w=majority`;

    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log("Connection Completed");
  } catch {
    console.error("Failed to connect", err);
  }
}

module.exports = { initializeDBConnection };
