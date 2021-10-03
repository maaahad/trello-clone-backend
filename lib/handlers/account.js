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
};
