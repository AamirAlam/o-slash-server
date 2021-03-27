const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./utils/db");

//Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());
app.options("*", cors());

//Connect Database
connectDB();

app.get("/", (req, res) =>
  res.send({ success: true, message: "Welcome to o-slash REST service :)" })
);

// routes

const auth = require("./routes/auth/v1/auth");
const posts = require("./routes/posts/v1/post");

app.use("/api/auth/v1/", auth);
app.use("/api/posts/v1/", posts);

module.exports = app;
