// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { userSchema } = require("./user");

// ----------------------------------------------------------- //
// schema
const checklistItemSchema = new mongoose.Schema({
  owner: userSchema,
  title: {
    type: String,
    required: true,
  },
  assignees: [userSchema],
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

module.exports = { ChecklistItem, checklistItemSchema };
