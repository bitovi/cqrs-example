//Set up mongoose connection
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose.Promise = global.Promise;

const db = mongoose
  .connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connected successfully to Database");
  })
  .catch((e: Error) => {
    console.log(e);
  });

export default db;
