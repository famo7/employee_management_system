const mongoose = require("mongoose");

const Attendance = mongoose.model(
  "Attendance",
  new mongoose.Schema({
    date: { type: Object },
    absent: {
      type: Boolean,
    },
    vacation: {
      type: Boolean,
    },
    reason: {
      type: String,
    },
    attFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  })
);

exports.Attendance = Attendance;
