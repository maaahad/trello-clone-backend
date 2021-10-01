// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { userSchema } = require("./user");

// ----------------------------------------------------------- //
// schema
const commentSchema = new mongoose.Schema({
  owner: {
    type: userSchema,
    required: true,
  },
  body: {
    type: String,
    default: "Comment does not have a body",
  },
  date: {
    type: Date,
    default: new Date(),
  },
  edited: {
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

// ----------------------------------------------------------- //
// model
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment, commentSchema };
