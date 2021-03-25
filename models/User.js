const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://s3-us-west-2.amazonaws.com/token-daily-bucket/user-images/4a2359b48887048317100f5e5d28d0d6.jpeg",
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
