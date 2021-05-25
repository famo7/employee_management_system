const bcrypt = require("bcrypt");

const { Employee } = require("../models/employee");
const { Attendance } = require("../models/attendance");
const router = require("express").Router();

router.post("/", async (req, res) => {
  // find employee using social security number
  let employee = await Employee.findOne({
    socialSecurityNumber: req.body.socialSecurityNumber,
  });
  // check if employee exists, if not send error message and return
  if (!employee) {
    return res.status(401).send("invalid social security number or password");
  }
  // compare the hashed password with the provided password using bcrypt
  const validPassword = await bcrypt.compare(
    req.body.password,
    employee.password
  );
  // check if password is valid
  if (!validPassword) {
    // if not a valid password send error message and return
    return res.status(401).send("invalid email or password");
  }
  // today date
  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();

  const today = { year: year, month: month, day: day };

  // get all attendances for current employee
  const att = await Attendance.find({ attFor: employee._id })
    .select("date")
    .select("-_id");
  let exists = false;

  // look if attendance has been registered today
  att.forEach((i) => {
    if (JSON.stringify(i.date) === JSON.stringify(today)) {
      exists = true;
    }
  });
  if (!exists) {
    // create attendace for the employee
    attendance = new Attendance({
      absent: false,
      date: today,
      attFor: employee._id,
    });
    attendance = await attendance.save();
    employee.attendances.push(attendance);
    employee.save();
  }

  //send back the jwt token
  const token = employee.generateToken();
  res.json({
    id: employee._id,
    token: token,
    firstName: employee.firstName,
    lastName: employee.lastName,
    isManager: employee.isManager,
    address: employee.address,
  });
});

//export router
module.exports = router;
