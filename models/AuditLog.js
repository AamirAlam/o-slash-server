const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
  },
  action_type: {
    type: String,
  },
  resource_type: {
    type: String,
  },
  success: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = AuditLog = mongoose.model("audit_logs", LogSchema);
