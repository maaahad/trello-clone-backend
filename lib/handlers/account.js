// ----------------------------------------------------------- //
// import
const db = require("../database/db");

// ----------------------------------------------------------- //
// handlers
module.exports = {
  // user
  getUserByEmail: async (req, res) => {
    const user = await db.getUserByEmail(req.params.email);
    res.status(200).json(user);
  },
  // workspaces, boards, cards
  // getWorkspacesByEmail: async (req, res) => {
  //   const workspaces = await db.getWorkspacesByEmail(req.params.email);
  //   res.status(200).json(workspaces);
  // },
  getWorkspaceById: async (req, res) => {
    const workspace = await db.getWorkspaceById(req.params.id);
    res.status(200).json(workspace);
  },
  getBoardById: async (req, res) => {
    const board = await db.getBoardById(req.params.id);
    res.status(200).json(board);
  },
  getCardById: async (req, res) => {
    const card = await db.getCardById(req.params.id);
    res.status(200).json(card);
  },
  // signup with email, name and password
  // !thirdParty, email and password is necessary
  // signup: async (req, res) => {
  //   const { user, dbStatus } = await db.signup(req.body);
  //   // repeated code...
  //   if (user) {
  //     const workspaces = await db.getWorkspacesByUserId(user._id);
  //     res.status(200).json({ user, workspaces });
  //   } else {
  //     res.status(400).json(dbStatus);
  //   }
  // },

  // login with email and password
  // login: async (req, res) => {
  //   const { user, dbStatus } = await db.login(req.body);
  //   // repeated code...
  //   if (user) {
  //     const workspaces = await db.getWorkspacesByUserId(user._id);
  //     res.status(200).json({ user, workspaces });
  //   } else {
  //     res.status(400).json(dbStatus);
  //   }
  // },

  // logout user using the user id
  logout: async (req, res) => {
    const user = await db.loggedUserOut(req.params.userid);
    req.logout();
    res.status(200).json(user);
  },
  // logout: async (req, res) => {
  //   const { user, dbStatus } = await db.logout(req.body.id);
  //   // repeated code...
  //   if (user) {
  //     res.status(200).json(user);
  //   } else {
  //     res.status(404).json(dbStatus);
  //   }
  // },
};
