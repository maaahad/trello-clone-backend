// // ----------------------------------------------------------- //
// import
const express = require("express");
const accountHandlers = require("../handlers/account");

const router = express.Router();

const routes = [
  {
    path: "/workspaces/:email",
    method: "get",
    handler: accountHandlers.getWorkspacesByEmail,
  },
  {
    path: "/workspace/:id",
    method: "get",
    handler: accountHandlers.getWorkspaceById,
  },
  {
    path: "/board/:id",
    method: "get",
    handler: accountHandlers.getBoardById,
  },
  {
    path: "/card/:id",
    method: "get",
    handler: accountHandlers.getCardById,
  },
];

routes.forEach((route) => router[route.method](route.path, route.handler));

module.exports = router;
