const mongoose = require("mongoose");

module.exports = function() {
  mongoose
    .connect(
      "mongodb+srv://muzwalks:test@clustermurray-fyjyv.mongodb.net/task14?retryWrites=true",
      { useNewUrlParser: true }
    )
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB..."));
};
