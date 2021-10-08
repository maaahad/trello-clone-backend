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
  // user
  getUserByEmail: async (email) => await User.findOne({ email }),
  // workspaces, boards and cards
  getWorkspacesByEmail: async (email) => {
    //   first we get the user using email
    // return await User.find({ email });
    const user = await User.findOne({ email });

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

  // signup with email, name and password
  // !thirdParty, email and password is necessary
  signup: async ({ name, email, password, thirdParty }) => {
    if (thirdParty) {
      return {
        success: false,
        message:
          "[BAD_REQUEST] : ThirdParty signup has not been implemented yet.",
      };
    }
    // We signup using our very own authentication system
    // email and password are mandatory
    if (!email || !password) {
      return {
        success: false,
        message:
          "[BAD_REQUEST] : Email and password are necessary. Frontend Signup form validaiton was not implemented properly.",
      };
    }
    // We check whether there is already a user registered with the email
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return {
        success: false,
        message: `[BAD_REQUEST] : ${email} is already registered. Try with another email.`,
      };
    }
    // everything fine now and the user is ready to be registered to the database
    // ||todo : Encrypt the password
    const user = await new User({ name, email, password }).save();
    if (user) {
      return {
        success: true,
        message: `${email} was registered successfully.`,
      };
    } else {
      return {
        success: false,
        message: `[DATABASE_ERROR] : ${email} was NOT registered.`,
      };
    }
  },

  // login with email and password
  login: async ({ email, password }) => {
    const user = await User.findOne({ email, password }, "_id email");
    const messageToBeSent = {};
    if (user) {
      if (user.signedin) {
        messageToBeSent = {
          success: false,
          message: `[IMPLEMENTATION_ERROR] : ${user.email} already logged in.`,
        };
      } else {
        // we update the signedin prop of user to true
        await User.updateOne({ email: user.email }, { signedin: true });
      }
    } else {
      messageToBeSent = {
        success: false,
        message: `[BAD_REQUEST] : ${email} is not registered with us.`,
      };
    }
    return { user, messageToBeSent };
  },

  // logout user
  logout: async (id) => {
    const user = await User.findById(id, "email signedin");
    if (!user?.signedin) {
      return {
        success: false,
        message: `[IMPLEMENTATION_ERROR] : ${user.email} is not registered or logged in.`,
      };
    } else {
      // not all user will have email in case we user oauth
      // ||todo user callback for return value
      await User.findByIdAndUpdate(user._id, { signedin: false });
      return {
        success: true,
        message: `${user.email} is successfully logged out.`,
      };
    }
  },
};
