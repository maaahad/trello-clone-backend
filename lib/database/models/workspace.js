// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { userSchema } = require("./user");
const { boardSchema } = require("./board");

// ----------------------------------------------------------- //
// schema
const workspaceSchema = new mongoose.Schema({
  owner: userSchema,
  title: {
    type: String,
    required: true,
  },
  members: [userSchema],
  boards: [boardSchema],
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
const Workspace = mongoose.model("Workspace", workspaceSchema);
module.exports = Workspace;
