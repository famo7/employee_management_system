const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// emoloyee schema
const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  salary: String,
  email: {
    unique: true,
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: String,
  },
  socialSecurityNumber: {
    unique: true,
    require: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  isManager: {
    required: true,
    type: Boolean,
  },
  attendances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  employed: {
    required: true,
    type: Boolean,
  },
  department: {
    required: true,
    type: String,
  },
});

// create method to generate jwt token using the schema
employeeSchema.methods.generateToken = function () {
  // return jwt containing id, first name, last name and if its manager
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      isManager: this.isManager,
    },
    process.env.tokenSecret
  );
};

const Employee = mongoose.model("Employee", employeeSchema);

exports.Employee = Employee;
