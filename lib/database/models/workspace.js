// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// schema
const workspaceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    default: "Not Specified",
  },
  descr: {
    type: String,
    default: "",
  },
  closed: {
    type: Boolean,
    default: false,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
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
