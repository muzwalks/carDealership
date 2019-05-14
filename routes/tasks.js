const asyncMiddleware = require("../middleware/async");
const { Task } = require("../model/task");
const { User } = require("../model/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const authCheck = (req, res, next) => {
  if (!req.user) {
    //if user is not logged in
    res.redirect("/");
  } else {
    //if logged in
    next();
  }
};

//this is the page where completed tasks are displayed
router.get(
  "/completedTasks",
  authCheck,
  asyncMiddleware(async (req, res) => {
    const id = req.user;
    //find the current user's id
    const user = await User.findById(id);
    // const username = await User.findOne({ _id: user }, { _id: 0, username: 1 });
    const tasks = await Task.find({ isCompleted: true });

    console.log(user);
    res.render("home/completedTasks", {
      currentUser: user,
      prods: tasks,
      pageTitle: "Completed tasks",
      path: "/home/completedTasks"
    });
  })
);

//this is the page where incompleted tasks are displayed
router.get(
  "/incompleteTasks",
  authCheck,
  asyncMiddleware(async (req, res) => {
    const id = req.user;
    //find the current user's id
    const user = await User.findById(id);
    // const username = await User.findOne({ _id: user }, { _id: 0, username: 1 });
    const tasks = await Task.find({ isCompleted: false });

    res.render("home/incompleteTasks", {
      currentUser: user,
      prods: tasks,
      pageTitle: "Incomplete tasks",
      path: "/home/incompleteTasks"
    });
  })
);

router.get(
  "/overdue",
  authCheck,
  asyncMiddleware(async (req, res) => {
    const id = req.user;
    const user = await User.findById(id);
    const tasks = await Task.find({ deadline: { $lte: new Date() } });
    console.log(tasks);
    res.render("home/overdue", {
      currentUser: user,
      prods: tasks,
      pageTitle: "Completed tasks",
      path: "/home/overdue"
    });
  })
);

//this renders the newTask page. The current user will be assigned as the tasker
router.get(
  "/newTask",
  authCheck,
  asyncMiddleware(async (req, res) => {
    const id = req.user;
    const user = await User.findById(id);
    console.log(user);
    res.render("home/newTask", {
      pageTitle: "New Task",
      path: "/home/newTask",
      currentUser: user
    });
  })
);

//this posts a new Task to mongodb and redirects to the incompletedTasks page
router.post(
  "/newTask",
  urlencodedParser,
  authCheck,
  asyncMiddleware(async (req, res) => {
    let task = new Task({
      task: req.body.task,
      deadline: req.body.deadline,
      commenced: req.body.commenced,
      username: req.body.username
    });
    task = await task.save();

    res.redirect("/incompleteTasks");
  })
);

//this renders the editTask page and fills the text fields with mongodb data so user can update
router.get(
  "/editTask",
  authCheck,
  asyncMiddleware(async (req, res) => {
    const id = req.query.productID;
    const task = await Task.findById(id);

    res.render("home/editTask", {
      prods: task,
      pageTitle: "All Tasks",
      path: "/home/editTask" //I don't understand why you have to stipulate the path as well. Isn't the path name in render enough?
    });
  })
);

//this is the put route
router.post(
  "/completedTasks",
  authCheck,
  urlencodedParser,
  asyncMiddleware(async (req, res) => {
    const id = req.body.productID;
    const task = await Task.findByIdAndUpdate(
      id,
      {
        task: req.body.task,
        isCompleted: req.body.isCompleted,
        completionDate: req.body.completionDate,
        deadline: req.body.deadline
      },
      {
        new: true
      }
    );

    if (!task)
      return res.status(404).send("The task with the given ID was not found.");

    res.redirect("/profile");
  })
);

router.post(
  "/deletetask",
  urlencodedParser,
  authCheck,
  asyncMiddleware(async (req, res) => {
    const id = req.body.productID;
    const task = await Task.findByIdAndDelete(id);

    if (!task)
      return res
        .status(404)
        .send("The task with the given ID was not bloody found.");

    res.redirect("/profile");
  })
);

router.get(
  "/lastMonth",
  authCheck,
  asyncMiddleware(async (req, res) => {
    const tasks = await Task.find({
      completionDate: {
        $lt: new Date(),
        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    });
    res.render("home/lastMonth", {
      prods: tasks,
      pageTitle: "lastMonth",
      path: "/home/lastMonth"
    });
  })
);

module.exports = router;
