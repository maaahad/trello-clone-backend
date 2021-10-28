const passport = require("passport");
const passportCustom = require("passport-custom");
const FacebookStrategy = require("passport-facebook").Strategy;
const CustomStrategy = passportCustom.Strategy;

const db = require("./database/db");

// serialize and deserialize user
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => {
  db.getUserById(id)
    .then((user) => done(null, user))
    .catch((error) => done(error, null));
});

// initialize passport and register routes along with callback from thirdparty
module.exports = (app, options) => {
  if (!options.successRedirect) options.successRedirect = "/user/home";
  if (!options.failureRedirect) options.failureRedirect = "/please/login";

  return {
    init: function () {
      const config = options.providers;
      passport.use(
        new FacebookStrategy(
          {
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: (options.baseUrl || "") + "/auth/facebook/callback",
          },
          (acessToken, refreshToken, profile, done) => {
            const authId = "facebook:" + profile.id;
            db.getUserByAuthId(authId)
              .then((user) => {
                if (user) return done(null, user);
                db.addUser({
                  authId: authId,
                })
                  .then((user) => done(null, user))
                  .catch((error) => done(error, null));
              })
              .catch((error) => done(error, null));
          }
        )
      );

      // we will have our own custom strategy
      // in-house signup
      passport.use(
        "inhouse-signup",
        new CustomStrategy((req, done) => {
          const { email, name, password, subscribed } = req.body;
          if (!email || !password) {
            return done(
              new Error(
                "Frontend validation required : Both email and password are mandatory..."
              ),
              null
            );
          }

          db.getUserByEmail(email)
            .then((user) => {
              if (user) {
                db.loggedUserIn(user.email, user.password)
                  .then((user) => done(null, user))
                  .catch((error) => done(error, null));
              } else {
                db.addUser({
                  name,
                  email,
                  password,
                  subscribed,
                  loggedin: true,
                })
                  .then((user) => done(null, user))
                  .catch((error) => done(error, null));
              }
            })
            .catch((error) => done(error, null));
        })
      );

      //  in-house login
      passport.use(
        "inhouse-login",
        new CustomStrategy((req, done) => {
          const { email, password } = req.body;
          db.loggedUserIn(email, password)
            .then((user) => {
              if (user) return done(null, user);
              else return done(new Error(`${email} is not registered`), null);
            })
            .catch((error) => done(error, null));
        })
      );

      app.use(passport.initialize());
      app.use(passport.session());
    },
    registerRoutes: function () {
      app.get("/auth/facebook", (req, res, next) => {
        if (req.query.redirect) req.session.authRedirect = req.query.redirect;
        passport.authenticate("facebook")(req, res, next);
      });
      app.get(
        "/auth/facebook/callback",
        passport.authenticate("facebook", {
          failureRedirect: options.failureRedirect,
        }),
        (req, res) => {
          const redirect = req.session.authRedirect;
          if (redirect) delete req.session.authRedirect;
          res.redirect(303, redirect || options.successRedirect);
        }
      );
      app.post(
        "/auth/signup/inhouse",
        passport.authenticate("inhouse-signup", {
          failureRedirect: "/auth/failed",
        }),
        (req, res) => {
          res.status(200).json(req.user);
        }
      );

      app.post(
        "/auth/login/inhouse",
        passport.authenticate("inhouse-login", {
          failureRedirect: "/auth/failed",
        }),
        (req, res) => {
          // we may need to add user's all workspaces for the homepage
          res.status(200).json(req.user);
        }
      );

      app.use("/auth/failed", (error, req, res, next) => {
        // we want to assign this as Server Error
        console.log("Error detected : ", error.message);
        next(error);
      });
    },
  };
};
