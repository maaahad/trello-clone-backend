// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { cardSchema } = require("./card");
const { userSchema } = require("./user");

// ----------------------------------------------------------- //
// schema
const cardlistSchema = new mongoose.Schema({
  owner: userSchema,
  title: {
    type: String,
    required: true,
  },
  cards: [cardSchema],
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
const Cardlist = mongoose.model("Cardlist", cardlistSchema);
module.exports = { Cardlist, cardlistSchema };
