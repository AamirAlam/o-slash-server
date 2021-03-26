const AuditLog = require("../models/AuditLog");

module.exports = async (user_id, action_type, resource) => {
  return new AuditLog({
    user: user_id,
    action_type: action_type,
    resource_type: resource.type,
    success: resource.success,
  }).save();
};
