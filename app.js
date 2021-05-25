require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());
const mongoose = require("mongoose");
// require modules from route folder
const attendances = require("./routes/attendances");
const employees = require("./routes/employees");
const tasks = require("./routes/tasks");
const login = require("./routes/login");
const messages = require("./routes/messages");
const times = require("./routes/time");
const stats = require("./routes/stats");

// use json
app.use(express.json());

// use the modules if route matches
app.use("/api/attendances", attendances);
app.use("/api/employees", employees);
app.use("/api/tasks", tasks);
app.use("/api/login", login);
app.use("/api/messages", messages);
app.use("/api/times", times);
app.use("/api/stats", stats);
app.use(express.static("build"));

mongoose
  .connect(
    `mongodb+srv://taja1900:${process.env.pass}@dt162g.7wqgk.mongodb.net/finalProjs?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("connected to db"))
  .catch((err) => console.error("could not connect to db"));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
