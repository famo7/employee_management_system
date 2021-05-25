const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Not started",
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
    },
    deadLine: {
      type: Date,
      required: true,
    },
    assignedTo: {
      type: String,
      required: true,
    },
  })
);

exports.Task = Task;
