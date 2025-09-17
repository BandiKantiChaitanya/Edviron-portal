const express = require('express');
const { paymentWebhook } = require('../controllers/webhookController');
const webhookRouter = express.Router();

webhookRouter.post('/payment-webhook',paymentWebhook)

module.exports=webhookRouter