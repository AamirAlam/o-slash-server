const express = require("express");

const app = express();

//Init Middleware
app.use(express.json({ extended: false }));

app.get("/__test", (req, res) => res.send({success:true, message: "API running"}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
