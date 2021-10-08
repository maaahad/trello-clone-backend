// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// schema
const cardSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  checklists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Checklist" }],
  dates: {
    start: Date,
    due: Date,
  },
  labels: [String],
});

// ----------------------------------------------------------- //
// statics
// ----------------------------------------------------------- //
// methods
// ----------------------------------------------------------- //
// virtuals
// fullname
// ----------------------------------------------------------- //
// model
const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
