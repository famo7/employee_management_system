// imports
const router = require("express").Router();
const auth = require("../middleware/auth");
const manager = require("../middleware/manager");
const { Task } = require("../models/task");

// get all tasks and calculate stats
router.get("/", [auth, manager], async (req, res) => {
  // query and count the statuses
  const finished = await Task.countDocuments({ status: "Finished" });
  const notStarted = await Task.countDocuments({
    status: "Not started",
  });
  const inProgress = await Task.countDocuments({
    status: "In progress",
  });
  let size = finished + notStarted + inProgress;
  // send the object
  res.send({
    finished: finished,
    notStarted: notStarted,
    inProgress: inProgress,
    size: size,
  });
});

module.exports = router;
