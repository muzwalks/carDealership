const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    task: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    dateNow: {
      type: Date,
      required: true,
      default: Date.now
    },
    commenced: {
      type: Date
    },
    completionDate: {
      type: Date
    },
    deadline: {
      type: Date
    },
    overdue: {
      type: Boolean,
      default: false
    },
    username: String
  })
);

exports.Task = Task;
