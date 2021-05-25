const { Attendance } = require("../models/attendance");
const { Employee } = require("../models/employee");

const router = require("express").Router();
const auth = require("../middleware/auth");
const manager = require("../middleware/manager");
// get all attendances
router.get("/", [auth, manager], async (req, res) => {
  const attendance = await Attendance.find();
  res.send(attendance);
});

router.post("/", [auth, manager], async (req, res) => {
  // create a new attendace using request body
  let attendance = new Attendance({
    date: req.body.date,
    absent: req.body.absent,
    vacation: req.body.vacation,
    reason: req.body.reason,
  });

  // save to db
  attendance = await attendance.save();
  res.send(attendance);
});

router.get("/:id", [auth, manager], async (req, res) => {
  // find attendance using id
  const attendance = await Attendance.findById(req.params.id);
  // if not found, return error message
  if (!attendance) {
    return res.status(404).send("attendance with given id does not exist");
  }
  // else return the attendace
  res.send(attendance);
});

router.put("/:id", [auth, manager], async (req, res) => {
  // find attendace using id and update
  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    {
      date: req.body.date,
      absent: req.body.absent,
      vacation: req.body.vacation,
      reason: req.body.reason,
    },
    {
      // return the new attendance
      new: true,
    }
  );
  // if attendace not found, send errror message and return
  if (!attendance) {
    return res.status(404).send("attendance with given id does not exist");
  }
  // else send the new attendace
  res.send(attendance);
});

router.delete("/:id", [auth, manager], async (req, res) => {
  // find attendace using id and delete
  const attendance = await Attendance.findByIdAndDelete(req.params.id);
  // if attendace not found, send error message and return
  if (!attendance) {
    return res.status(404).send("attendance with given id does not exist");
  }

  // else send deleted attendance
  res.send(attendance);
});

module.exports = router;
