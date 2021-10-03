// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// schema
const boardSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  cardlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cardlist" }],
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
module.exports = Board;
