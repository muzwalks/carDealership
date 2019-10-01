const { User } = require("../model/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const passport = require("passport");

//auth login
router.get("/", (req, res) => {
  res.render("home/home", {
    pageTitle: "Login",
    path: "/home/home",
    user: req.user
  });
  console.log(user);
});

//auth logout
router.get("/logout", (req, res) => {
  //handle with passport
  req.logout();
  res.redirect("/");
});

//auth with google
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/thankyou");
});

module.exports = router;
