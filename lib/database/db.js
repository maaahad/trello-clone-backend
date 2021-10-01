// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { credentials } = require("../../config");

// ----------------------------------------------------------- //
// connection string
const connectionstring = credentials.mongodb.connectionstring;

if (!connectionstring) {
  console.error("MongoDB connection string missing. Exiting...");
  process.exit(1);
}

// ----------------------------------------------------------- //
// connect to MongoDB and registering handler to connection
mongoose.connect(connectionstring, {});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error(`MongoDB error: ${error.message}`);
  process.exit(1);
});

db.once("open", () => {
  console.log("Connection to MongoDB was successfull");
});

// ----------------------------------------------------------- //
// exposing db api to be used by route handlers
module.exports = {};
