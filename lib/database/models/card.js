// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { commentSchema } = require("./comment");
const { checklistSchema } = require("./checklist");
const { userSchema } = require("./user");

// ----------------------------------------------------------- //
// schema
const cardSchema = new mongoose.Schema({
  owner: userSchema,
  title: {
    type: String,
    required: true,
  },
  description: String,
  comments: [commentSchema],
  checklists: [checklistSchema],
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
module.exports = { Card, cardSchema };
