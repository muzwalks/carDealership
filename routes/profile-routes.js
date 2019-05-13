const router = require("express").Router();
const { User } = require("../model/user");
const passport = require("passport");
const asyncMiddleware = require("../middleware/async");

const authCheck = (req, res, next) => {
  if (!req.user) {
    //if user is not logged in
    res.redirect("/");
  } else {
    //if logged in
    next();
  }
};

//this is the profile welcome page
router.get(
  "/",
  authCheck,
  asyncMiddleware(async (req, res) => {
    const id = req.user;
    const user = await User.findById(id);
    console.log(user);
    res.render("home/profile", {
      pageTitle: "All Tasks",
      path: "/home/profile",
      currentUser: user
    });
  })
);

module.exports = router;
