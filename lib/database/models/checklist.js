// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// schema
const checklistSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    default: "Checklist",
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChecklistItem" }],
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
const Checklist = mongoose.model("Checklist", checklistSchema);

module.exports = Checklist;
