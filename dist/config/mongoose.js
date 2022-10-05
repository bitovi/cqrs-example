"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Set up mongoose connection
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
mongoose.Promise = global.Promise;
const db = mongoose
    .connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
    console.log("Connected successfully to Database");
})
    .catch((e) => {
    console.log(e);
});
exports.default = db;
