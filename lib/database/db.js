// ----------------------------------------------------------- //
// importing
const mongoose = require("mongoose");
const { credentials } = require("../../config");

// models
const Workspace = require("./models/workspace");
const User = require("./models/user");
const Board = require("./models/board");
const Cardlist = require("./models/cardlist");
const Card = require("./models/card");
const Checklist = require("./models/checklist");
const ChecklistItem = require("./models/checklist-item");
const Comment = require("./models/comment");

// ----------------------------------------------------------- //
// seeding for testing
const seeding = require("../seeding");

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
// seeding.seed().catch(console.error);
// seeding.addMembersToWorkspace().catch(console.error);

// ----------------------------------------------------------- //
// exposing db api to be used by route handlers
module.exports = {
  getWorkspacesByEmail: async (email) => {
    //   first we get the user using email
    // return await User.find({ email });
    const user = await User.findOne({ email });

    console.log(`[TESTING_DB] : user ${user.email}`);
    if (user && user.signedin) {
      return await Workspace.find(
        { members: { $in: [user._id] } },
        "_id title"
      );
    } else {
      console.error(
        `[IMPLEMENTATION_ERROR] : User ${email} is neither registered nor signed in. Still there is a questing for Workspaces`
      );
    }
  },

  getWorkspaceById: async (id) => {
    return await Workspace.findById(id)
      .populate({
        path: "owner",
        select: "email -_id",
      })
      .populate({
        path: "members",
        select: "email -_id",
      })
      .populate({
        path: "boards",
        select: "_id title",
      });
  },

  getBoardById: async (id) => {
    return Board.findById(id)
      .populate({
        path: "owner",
        select: "email -_id",
      })
      .populate({
        path: "members",
        select: "email -_id",
      })
      .populate({
        path: "cardlists",
        populate: [
          {
            path: "owner",
            select: "email -_id",
          },
          {
            path: "cards",
            select: "_id title",
          },
        ],
      });
  },

  getCardById: async (id) => {
    return await Card.findById(id)
      .populate({
        path: "owner",
        select: "email -_id",
      })
      .populate({
        path: "comments",
        populate: { path: "owner", select: "email -_id" },
      })
      .populate({
        path: "checklists",
        populate: [
          {
            path: "owner",
            select: "email -_id",
          },
          {
            path: "items",
            populate: [
              {
                path: "owner",
                select: "email -_id",
              },
              {
                path: "assignees",
                select: "email -_id",
              },
            ],
          },
        ],
      });
  },
};
