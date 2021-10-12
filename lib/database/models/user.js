// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");

// ----------------------------------------------------------- //
// schema
const userSchema = new mongoose.Schema({
  authId: String,
  email: String,
  name: String,
  password: String,
  loggedin: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: new Date(),
  },
  subscribed: {
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

module.exports = User;
