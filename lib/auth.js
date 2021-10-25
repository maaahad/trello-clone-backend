const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

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
    },
  };
};
