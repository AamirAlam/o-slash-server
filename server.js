const express = require("express");

const app = express();
const connectDB = require("./config/db");
const cors = require("cors");

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());
app.options("*", cors());

app.get("/", (req, res) =>
  res.send({ success: true, message: "Welcome to o-slash REST service :)" })
);

app.use("/api/auth/v1/", require("./routes/auth/v1/auth"));
app.use("/api/posts/v1/", require("./routes/posts/v1/post"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
