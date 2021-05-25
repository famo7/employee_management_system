const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    date: {
      type: Date,
      default: Date.now(),
    },
    from: {
      required: true,
      type: String,
    },
    to: {
      required: true,
      type: String,
    },

    title: {
      type: String,
    },
    body: {
      type: String,
    },
  })
);

exports.Message = Message;
