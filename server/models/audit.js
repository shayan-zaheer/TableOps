const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    action: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  const AuditLog = mongoose.model('AuditLog', auditLogSchema);
  module.exports = AuditLog;