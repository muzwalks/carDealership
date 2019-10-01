const { Task } = require("../model/task");
const { User } = require("../model/user");
const asyncMiddleware = require("../middleware/async");

exports.getCompletedTasks = asyncMiddleware(async (req, res) => {
  const id = req.user;
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
});

exports.getIncompleteTasks = asyncMiddleware(async (req, res) => {
  const id = req.user;
  const user = await User.findById(id);
  const tasks = await Task.find({ isCompleted: false });

  res.render("home/incompleteTasks", {
    currentUser: user,
    prods: tasks,
    pageTitle: "Incomplete tasks",
    path: "/home/incompleteTasks"
  });
});

exports.getOverdueTasks = asyncMiddleware(async (req, res) => {
  const id = req.user;
  const user = await User.findById(id);
  const tasks = await Task.find({
    deadline: { $lte: new Date() }
  });
  console.log(tasks);
  res.render("home/overdue", {
    currentUser: user,
    prods: tasks,
    pageTitle: "Completed tasks",
    path: "/home/overdue"
  });
});

exports.getLastmonthTasks = asyncMiddleware(async (req, res) => {
  const id = req.user;
  const user = await User.findById(id);
  const tasks = await Task.find({
    completionDate: {
      $lt: new Date(),
      $gte: new Date(new Date().setDate(new Date().getDate() - 30))
    }
  });
  res.render("home/lastMonth", {
    currentUser: user,
    prods: tasks,
    pageTitle: "lastMonth",
    path: "/home/lastMonth"
  });
});

exports.getNewTask = asyncMiddleware(async (req, res) => {
  const id = req.user;
  const user = await User.findById(id);
  console.log(user);
  res.render("home/newTask", {
    pageTitle: "New Task",
    path: "/home/newTask",
    currentUser: user
  });
});

exports.getEditTask = asyncMiddleware(async (req, res) => {
  const id = req.query.productID;
  const task = await Task.findById(id);
  res.render("home/editTask", {
    path: "/home/editTask",
    pageTitle: "Edit Task",
    prod: task
  });
});

exports.postNewTask = asyncMiddleware(async (req, res) => {
  let task = new Task({
    task: req.body.task,
    deadline: req.body.deadline,
    commenced: req.body.commenced,
    username: req.body.username
  });
  task = await task.save();
  res.redirect("/incompleteTasks");
});

//this is the put route
exports.postUpdateTask = asyncMiddleware(async (req, res) => {
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
});

exports.postDeleteTask = asyncMiddleware(async (req, res) => {
  const id = req.body.productID;
  const task = await Task.findByIdAndDelete(id);

  if (!task)
    return res
      .status(404)
      .send("The task with the given ID was not bloody found.");

  res.redirect("/profile");
});
