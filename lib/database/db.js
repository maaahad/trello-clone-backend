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
  // auth
  loggedUserIn: async (email, password) => {
    const user = await User.findOneAndUpdate(
      { email, password },
      { loggedin: true }
    );
    if (user) return await User.findById(user._id);
    return null;
  },

  loggedUserOut: async (id) => {
    const user = await User.findByIdAndUpdate(id, { loggedin: false });
    if (user) return await User.findById(user._id);
    return null;
  },
  // user
  getUserByEmail: async (email) => await User.findOne({ email }),
  getUserById: async (id) => await User.findById(id),
  getUserByAuthId: async (authId) => await User.findOne({ authId: authId }),
  addUser: async (user) => await new User(user).save(),
  getWorkspacesByUserId: async (id) => {
    const user = await User.findById(id);
    if (user && user.loggedin) {
      return await Workspace.find(
        { members: { $in: [user._id] } },
        "_id title"
      );
    } else {
      console.error(
        `[IMPLEMENTATION_ERROR] : User ${id} is neither registered nor signed in. Still there is a questing for Workspaces`
      );
    }
  },
  // workspaces, boards and cards
  getWorkspacesByEmail: async (email) => {
    // || tod : return all workspaces this email is a member of
    // || replace this by user _id instead of email
    const user = await User.findOne({ email });

    if (user && user.loggedin) {
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
  signup: async ({ name, email, password, subscribed, thirdParty }) => {
    // || todo : return only the information after signup
    const dbStatus = null;
    if (thirdParty) {
      dbStatus = {
        success: false,
        message:
          "[BAD_REQUEST] : ThirdParty signup has not been implemented yet.",
      };
    }
    // We signup using our very own authentication system
    // email and password are mandatory
    if (!email || !password) {
      dbStatus = {
        success: false,
        message:
          "[BAD_REQUEST] : Email and password are necessary. Frontend Signup form validaiton was not implemented properly.",
      };
    }
    // We check whether there is already a user registered with the email
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      dbStatus = {
        success: false,
        message: `[BAD_REQUEST] : ${email} is already registered. Try with another email.`,
      };
    }
    // everything fine now and the user is ready to be registered to the database
    // ||todo : Encrypt the password
    const user = await new User({
      name,
      email,
      password,
      subscribed,
      loggedin: true,
    }).save();

    if (!user) {
      dbStatus = {
        success: false,
        message: `[DATABASE_ERROR] : ${email} was NOT registered.`,
      };
    }
    return { user, dbStatus };
  },

  // login with email and password
  login: async ({ email, password }) => {
    // || todo : return only the information after login
    const user = await User.findOne({ email, password }, "_id email name");
    if (user) {
      if (user.loggedin) {
        return {
          user: null,
          dbStatus: {
            success: false,
            message: `[IMPLEMENTATION_ERROR] : ${user.email} already logged in.`,
          },
        };
      } else {
        // we update the loggedin prop of user to true
        await User.updateOne({ email: user.email }, { loggedin: true });
        const updateUser = await User.findById(user._id);

        return { user: updateUser, dbStatus: null };
      }
    } else {
      return {
        user: null,
        dbStatus: {
          success: false,
          message: `[BAD_REQUEST] : ${email} is not registered with us.`,
        },
      };
    }
  },

  // logout user
  logout: async (id) => {
    const user = await User.findById(id, "email loggedin");
    if (!user?.loggedin) {
      return {
        user: null,
        dbStatus: {
          success: false,
          message: `[IMPLEMENTATION_ERROR] : ${user.email} is not registered or logged in.`,
        },
      };
    } else {
      // not all user will have email in case we user oauth
      // ||todo user callback for return value
      return {
        user: await User.findByIdAndUpdate(user._id, { loggedin: false }),
        dbStatus: null,
      };
    }
  },
};
