// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { checklistItemSchema } = require("./checklist-item");
const { userSchema } = require("./user");

// ----------------------------------------------------------- //
// schema
const checklistSchema = new mongoose.Schema({
  owner: userSchema,
  title: {
    type: String,
    default: "Checklist",
  },
  items: [checklistItemSchema],
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

module.exports = { Checklist, checklistSchema };
