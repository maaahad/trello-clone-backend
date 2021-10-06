// ----------------------------------------------------------- //
// imporging modules
const express = require("express");

// middlewares
const loggingMiddleware = require("./lib/middlewares/logging");

// routers
const accountRouter = require("./lib/routes/account");

// an instance of express app and a port to start the app
const app = express();

// ----------------------------------------------------------- //
// middlewares
// bodyparser
app.use(express.json());

// logging
loggingMiddleware(app);

// ----------------------------------------------------------- //
// || test
app.get("/", (req, res) => {
  res.status(200).json({ message: "Success ... WOW !!!" });
});

// ----------------------------------------------------------- //
// adding routers
app.use("/account", accountRouter);

// ----------------------------------------------------------- //
// custom 404 and 500 response
// || todo : move it to it's own module

// 404
app.use((req, res) => {
  res.type("text/plain");
  res.status(404).send("404 - Not Found");
});

// 500
app.use((req, res, error, next) => {
  console.error(error.message);
  res.type("text/plain");
  res.status(500).send("500 - Server Error");
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
  startServer(process.env.PORT || 3000);
} else {
  // this is module
  module.exports = startServer;
}
