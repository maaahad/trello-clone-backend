// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// schema
const checklistItemSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  due: Date,
  checked: {
    type: Boolean,
    default: false,
  },
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
const ChecklistItem = mongoose.model("ChecklistItem", checklistItemSchema);

module.exports = ChecklistItem;
