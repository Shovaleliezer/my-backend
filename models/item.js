const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  amazonLink: {
    type: String,
    required: true,
  },
  aliexpressLink: {
    type: String,
    required: true,
  },
  dateOfUpload: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
