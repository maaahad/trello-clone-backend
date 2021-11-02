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
  getWorkspacesByUserId: async (req, res) => {
    const workspaces = await db.getWorkspacesByUserId(req.params.userid);
    res.status(200).json(workspaces);
  },
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

  // logout user using the user id
  logout: async (req, res) => {
    const user = await db.loggedUserOut(req.params.userid);
    req.logout();
    res.status(200).json(user);
  },

  // create
  createWorkspace: async (req, res) => {
    // we may try to use the req.user session here
    if (req.body.userId) {
      const workspace = await db.createWorkspace(req.body);
      res.status(200).json(workspace);
    } else {
      res.status(403).json({ message: "Not Authorized" });
    }
  },
};
