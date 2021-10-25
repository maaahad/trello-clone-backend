// ----------------------------------------------------------- //
// imporging modules
const express = require("express");
const cors = require("cors");
const expressSession = require("express-session");

// middlewares
const loggingMiddleware = require("./lib/middlewares/logging");

// auth middlewares
const createAuth = require("./lib/auth");

// credentials
const { credentials } = require("./config");

// routers
const accountRouter = require("./lib/routes/account");

// an instance of express app and a port to start the app
const app = express();

// get an instance of auth
const auth = createAuth(app, {
  baseUrl: "http://localhost:3033",
  successRedirect: "/user/home",
  failureRedirect: "/please/login",
  providers: credentials.authProviders,
});

// ----------------------------------------------------------- //
// middlewares

// session
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "__anabia_ahad__",
  })
);

// cors
// we need to use cors to make the api public
// || todo : add fine-grained control case-by-case
app.use("/account", cors());

// bodyparser
app.use(express.json());

// logging
loggingMiddleware(app);

// init and register routes for auth
auth.init();
auth.registerRoutes();

// ----------------------------------------------------------- //
// || test
app.get("/", (req, res) => {
  res.status(200).json({ message: "Success ... WOW !!!" });
});

// ----------------------------------------------------------- //
// adding routers
app.use("/account", accountRouter);

// ----------------------------------------------------------- //
// || testing : third party auth
app.get("/user/home", (req, res) => {
  if (!req.user) return res.redirect(303, "/unauthorized");

  res.status(200).json({ success: "success", user: req.user });
});

app.get("/please/login", (req, res) => {
  res.status(200).json({ message: "please log in" });
});

app.get("/unauthorized", (req, res) => {
  res.status(403).json({ message: "You are not authorized" });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// ----------------------------------------------------------- //
// custom 404 and 500 response
// || todo : move it to it's own module

// 404
app.use((req, res) => {
  res.type("text/plain");
  res.status(404).send("404 - Not Found");
});

// 500
app.use((error, req, res, next) => {
  console.error(error.message);
  res.type("text/plain");
  res.status(500).send("500 - Server Error : " + error);
});

// ----------------------------------------------------------- //
// starting the server
function startServer(port) {
  app.listen(port, () => {
    console.log(
      `Server is running on http://localhost:${port}, Press ctrl + c to terminate`
    );
  });
}

// ----------------------------------------------------------- //
// making this file to behave line top level script and a module as well
if (require.main === module) {
  // this is top level script
  startServer(process.env.PORT || 3033);
} else {
  // this is module
  module.exports = startServer;
}
