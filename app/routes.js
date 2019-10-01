const express = require("express");
const tasks = require("../routes/tasks");
// const users = require("../routes/users");
const authRoutes = require("../routes/auth-routes");
const profileRoutes = require("../routes/profile-routes");
const error = require("../middleware/error");
const path = require("path");
const passportSetup = require("../config/passport-setup");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("../config/keys");

module.exports = function(app) {
  app.set("view engine", "ejs");
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: [keys.session.cookieKey]
    })
  );

  //initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.json());
  app.use("/", tasks);
  app.use("/", authRoutes);
  app.use("/profile", profileRoutes);
  app.use("/thankyou", profileRoutes);
  // app.use("/", users);
  app.use(error);
  app.use(express.static(path.join(__dirname, "public")));
};
