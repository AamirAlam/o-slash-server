const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
  },
  request_type: {
    type: String,
  },
  updated_data: {
    type: Schema.Types.Mixed,
  },
  moderator: {
    type: Schema.Types.ObjectId,
  },
  modified_at: {
    type: Date,
    default: Date.now(),
  },
  approved: {
    type: Boolean,
    default: false,
  },
  approved_at: {
    type: Date,
    default: null,
  },
});

module.exports = ModeratorRequest = mongoose.model(
  "moderator_requests",
  RequestSchema
);
