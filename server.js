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

// email
const mailTransport = require("./lib/email");

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
app.use("/auth", cors());

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
  const availableRoutes = {
    account: {
      getUserByEmail: "/account/user/email",
      getWorkspaceById: "/account/workspace/id",
      getBoardById: "/account/board/id",
      getCardById: "/account/card/id",
      logout: "/account/user/logout",
    },
    auth: {
      facebook: "/auth/facebook",
      "inhouse-signup": "/auth/signup/inhouse",
      "inhouse-login": "/auth/login/inhouse",
    },
  };
  res.status(200).json(availableRoutes);
});

// || testing emial sendind
app.get("/send-email", (req, res) => {
  // reference
  // https://github.com/nodemailer/nodemailer-sendgrid/blob/master/examples/mail.js
  mailTransport
    .sendMail({
      // from: '"Trello-clone-maaahad" <do-not-reply@trello-clone-maaahad.com>',
      from: "Trello Clone - maaahad <maaahad@gmail.com>",
      to: "Muhammed Ahad <ahad3112@yahoo.com>",
      subject:
        "Testing mail sending form Trello clone using Nodemailer and SendGrid",
      html: "<h1>This is a testing mail from Trello clone using nodemailer</h1>",
    })
    .then(([res]) =>
      console.log(
        `Message delivered with status code ${res.statusCode} ${res.statusMessage}`
      )
    )
    .catch((error) => {
      console.log("Error occured. Failed to deliver message.");
      if (error.response && error.response.body && error.response.body.errors) {
        error.response.body.errors.forEach((error) =>
          console.log(`${error.field} : ${error.message}`)
        );
      } else {
        console.log(error);
      }
    });
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
  // change the database to set loggedin to false
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
