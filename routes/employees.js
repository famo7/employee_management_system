const { Employee } = require("../models/employee");
const router = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const schema = require("../helpers/empSchema");
const auth = require("../middleware/auth");
const manager = require("../middleware/manager");

// fields to send back in the response body
const employeeFields = [
  "_id",
  "firstName",
  "lastName",
  "address",
  "salary",
  "email",
  "employed",
  "department",
  "isManager",
  "attendances",
  "tasks",
];

// get all employees
router.get("/", [auth, manager], async (req, res) => {
  // find all employees without the fields
  // password and messages, and populate data
  const employees = await Employee.find()
    .populate("tasks")
    .populate("attendances")
    .select("-password")
    .select("-messages");

  res.send(employees);
});

// add employee
router.post("/", [auth, manager], async (req, res) => {
  // try to validate request body with shema module
  try {
    const value = await schema.validateAsync({
      email: req.body.email,
      password: req.body.password,
      socialSecurityNumber: req.body.socialSecurityNumber,
    });
    // catch errors and return if error
  } catch (err) {
    return res.send(err.details[0].message);
  }
  // create new employee using request body
  let employee = new Employee(req.body);

  // hash the password using bcrypt
  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(employee.password, salt);

  // save
  employee = await employee.save();
  // send back the new employee with employeeFields
  res.send(_.pick(employee, employeeFields));
});

router.get("/:id", [auth, manager], async (req, res) => {
  // find employee using id
  const employee = await Employee.findById(req.params.id);
  // check if employee is found, if not send error message and return
  if (!employee) {
    return res.status(404).send("employee with given id does not exist");
  }

  // send back the new employee with employeeFields
  res.send(_.pick(employee, employeeFields));
});

router.put("/:id", auth, async (req, res) => {
  // hash the password in request body

  let pass = "";
  // if there is password, then hash the password
  if (req.body.password) {
    // hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    pass = await bcrypt.hash(req.body.password, salt);
  } else {
    // or use the same password
    let employee = await Employee.findById(req.params.id);
    pass = employee.password;
  }
  // get employee and update address and password
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      address: req.body.address,
      password: pass,
    },
    {
      // employee will contain the new values
      new: true,
    }
  );
  // if there is no employee return with error message
  if (!employee) {
    return res.status(404).send("employee with given id does not exist");
  }

  // send back the new employee with employeeFields
  res.send(_.pick(employee, employeeFields));
});

router.delete("/:id", [auth, manager], async (req, res) => {
  // find employee using id and delete
  const employee = await Employee.findByIdAndDelete(req.params.id);
  // if employee not found, send error message and return
  if (!employee) {
    return res.status(404).send("employee with given id does not exist");
  }

  // send back the new employee with employeeFields
  res.send(_.pick(employee, employeeFields));
});

module.exports = router;
