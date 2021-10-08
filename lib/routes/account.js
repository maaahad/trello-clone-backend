// // ----------------------------------------------------------- //
// import
const express = require("express");
const accountHandlers = require("../handlers/account");

const router = express.Router();

const routes = [
  // user
  {
    path: "/user/:email",
    method: "get",
    handler: accountHandlers.getUserByEmail,
  },
  // workspaces, boards, cards
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

  // signup
  {
    path: "/user/signup",
    method: "post",
    handler: accountHandlers.signup,
  },

  // login
  {
    path: "/user/login",
    method: "put",
    handler: accountHandlers.login,
  },

  // logout
  {
    path: "/user/logout",
    method: "put",
    handler: accountHandlers.logout,
  },
];

routes.forEach((route) => router[route.method](route.path, route.handler));

module.exports = router;
