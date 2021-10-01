// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { credentials } = require("../../config");

// models
const Workspace = require("./models/workspace");
const { User } = require("./models/user");

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
// seeding some initial data for testing
// require("../seeding")();

// ----------------------------------------------------------- //
// exposing db api to be used by route handlers
module.exports = {
  getWorkspacesByEmail: async (email) => {
    //   first we get the user using email
    const user = await User.find({ email });
    console.log(`[TESTING_DB] : user ${user.signedin}`);
    if (!user || (user && !user.signedin)) {
      console.error(
        `[IMPLEMENTATION_ERROR] : User ${email} is neither registered nor signed in. Still there is a questing for Workspaces`
      );
    } else {
      return await Workspace.find({ owner: user.id });
    }
  },
};
