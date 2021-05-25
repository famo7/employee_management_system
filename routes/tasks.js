const { Task } = require("../models/task");
const router = require("express").Router();
const { Employee } = require("../models/employee");
const auth = require("../middleware/auth");
const manager = require("../middleware/manager");

// get all tasks
router.get("/", auth, async (req, res) => {
  // get all tasks assigned to current employee

  const tasks = await Employee.find({ _id: req.user._id })
    .select("tasks")
    .populate("tasks");
  res.send(tasks[0]);
});

router.post("/", [auth, manager], async (req, res) => {
  // create a new task using request body

  let task = new Task({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    createdBy: req.user.firstName + " " + req.user.lastName,
    deadLine: req.body.deadLine,
    assignedTo: req.body.assignedTo,
  });

  // save to db
  task = await task.save();
  // get the employee the task is assigned to
  const employee = await Employee.findOne({
    socialSecurityNumber: req.body.assignedTo,
  });

  if (!employee) {
    return res.status(404).send("employee not found");
  }

  // add task to who its assigend to

  employee.tasks.push(task._id);
  await employee.save();

  // send task
  res.send(task);
});

router.get("/:id", auth, async (req, res) => {
  // find task using id
  const task = await Task.findById(req.params.id);
  // if not found, return error message
  if (!task) {
    return res.status(404).send("Task with given id does not exist");
  }
  // else return the task
  res.send(task);
});

router.put("/:id", auth, async (req, res) => {
  // find task using id and update
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      // return the new task
      new: true,
    }
  );
  // if task not found, send errror message and return
  if (!task) {
    return res.status(404).send("Task with given id does not exist");
  }
  // else send the new task
  res.send(task);
});

router.delete("/:id", [auth, manager], async (req, res) => {
  // find task using id and delete
  const task = await Task.findByIdAndDelete(req.params.id);
  // if task not found, send error message and return
  if (!task) {
    return res.status(404).send("Task with given id does not exist");
  }
  // else send deleted task
  res.send(task);
});

module.exports = router;
