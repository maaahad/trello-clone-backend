// ----------------------------------------------------------- //
// import
const db = require("../database/db");
// ----------------------------------------------------------- //
// handlers
module.exports = {
  getWorkspacesByEmail: async (req, res) => {
    const workspaces = await db.getWorkspacesByEmail(req.params.email);
    res.status(200).json(workspaces);
  },
  getWorkspaceById: async (req, res) => {
    const workspace = await db.getWorkspaceById(req.params.id);
    res.status(200).json(workspace);
  },
  getCardById: async (req, res) => {
    const board = await db.getBoardById(req.params.id);
    res.status(200).json(board);
  },
};
