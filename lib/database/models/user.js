// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  firstname: String,
  lastname: String,
  password: {
    type: String,
    required: true,
  },
  thirdPartyAuthed: {
    type: Boolean,
    default: false,
  },
  signedin: {
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
const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };
