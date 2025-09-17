const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  raw_payload: mongoose.Schema.Types.Mixed,
  received_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WebhookLog', webhookLogSchema);
