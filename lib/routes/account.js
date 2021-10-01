// // ----------------------------------------------------------- //
// import
const express = require("express");
const accountHandlers = require("../handlers/account");

const router = express.Router();

const routes = [
  {
    path: "/workspaces/:email",
    method: "get",
    handler: accountHandlers.getWorkspacesByEmailHandler,
  },
];

routes.forEach((route) => router[route.method](route.path, route.handler));

module.exports = router;
