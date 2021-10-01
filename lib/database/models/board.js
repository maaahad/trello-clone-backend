// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { userSchema } = require("./user");
const { cardlistSchema } = require("./cardlist");

// ----------------------------------------------------------- //
// schema
const boardSchema = new mongoose.Schema({
  owner: userSchema,
  title: {
    type: String,
    required: true,
  },
  members: [userSchema],
  cardlists: [cardlistSchema],
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
const Board = mongoose.model("Board", boardSchema);
module.exports = { Board, boardSchema };
