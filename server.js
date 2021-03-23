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

app.get("/__test", (req, res) => res.send({success:true, message: "API running"}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
