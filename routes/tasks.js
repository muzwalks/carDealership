const asyncMiddleware = require("../middleware/async");

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const adminController = require("../controllers/admin");

const authCheck = (req, res, next) => {
  if (!req.user) {
    //if user is not logged in
    res.redirect("/");
  } else {
    //if logged in
    next();
  }
};

router.get(
  "/completedTasks",
  authCheck,

  adminController.getCompletedTasks
);
router.get("/incompleteTasks", authCheck, adminController.getIncompleteTasks);
router.get("/overdue", authCheck, adminController.getOverdueTasks);
router.get("/lastmonth", authCheck, adminController.getLastmonthTasks);
router.get("/edittask", authCheck, adminController.getEditTask);
router.get("/newtask", authCheck, adminController.getNewTask);

router.post(
  "/newtask",
  authCheck,
  urlencodedParser,
  adminController.postNewTask
);
router.post(
  "/completedtasks",
  authCheck,
  urlencodedParser,
  adminController.postUpdateTask
);
router.post(
  "/deletetask",
  authCheck,
  urlencodedParser,
  adminController.postDeleteTask
);

module.exports = router;
