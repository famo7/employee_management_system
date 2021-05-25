const { Message } = require("../models/message");
const { Employee } = require("../models/employee");

const router = require("express").Router();
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  // get correct employee and select the messages and populate the messages
  const messages = await Employee.find({ _id: req.user._id })
    .select("messages")
    .populate("messages");
  res.send(messages[0]);
});

router.post("/", auth, async (req, res) => {
  // create a new message using request body
  const name = req.user.firstName + " " + req.user.lastName;
  let message = new Message({
    date: req.body.date,
    from: name,
    to: req.body.to,
    title: req.body.title,
    body: req.body.body,
  });

  // save to db
  message = await message.save();
  const employee = await Employee.findOne({
    socialSecurityNumber: req.body.to,
  });

  if (!employee) {
    return res.status(404).send("employee not found");
  }

  // add message to who its  to

  employee.messages.push(message._id);

  await employee.save();

  res.send(message);
});

router.delete("/:id", auth, async (req, res) => {
  // find message using id and delete
  const message = await Message.findByIdAndDelete(req.params.id);
  // if message not found, send error message and return
  if (!message) {
    return res.status(404).send("Message with given id does not exist");
  }
  // else send deleted message
  res.send(message);
});

module.exports = router;
