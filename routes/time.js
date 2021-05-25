const { Task } = require("../models/task");
const router = require("express").Router();
const auth = require("../middleware/auth");

router.put("/:id", auth, async (req, res) => {
  // find task using id and update
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    },
    {
      // return the new task
      new: true,
    }
  );
  // if task not found, send error message and return
  if (!task) {
    return res.status(404).send("Task with given id does not exist");
  }
  // else send the new task
  res.send(task);
});

module.exports = router;
