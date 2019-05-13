const mongoose = require("mongoose");

const User = mongoose.model(
  "users",
  new mongoose.Schema({
    username: String,
    googleId: String
  })
);

exports.User = User;
