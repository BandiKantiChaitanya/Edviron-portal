const webhooklogSchema = require("../models/webhooklogSchema");
const orderStatusSchema = require("../models/orderStatusSchema");

const paymentWebhook = async (req, res) => {
  try {
    const payload = req.body;

    // 1. Log the raw webhook payload
    await webhooklogSchema.create({ raw_payload: payload });

    // 2. Extract fields from webhook
    const {
      order_info = {}
    } = payload;

    const {
      order_id: collect_request_id,
      order_amount,
      transaction_amount,
      payment_mode,
      bank_reference,
      payment_message,
      payment_time,
      status,
      payemnt_details, // typo from API payload — keep this key
      error_message
    } = order_info;

    if (!collect_request_id) {
      return res.status(400).json({ error: 'Missing collect_request_id in webhook payload' });
    }

    // 3. Update order status document
    const updated = await orderStatusSchema.findOneAndUpdate(
      { collect_request_id },
      {
        order_amount: order_amount || 0,
        transaction_amount: transaction_amount || 0,
        status: status || 'PENDING',
        payment_mode: payment_mode || '',
        payment_details: payemnt_details || '', // typo used by API
        bank_reference: bank_reference || '',
        payment_message: payment_message || '',
        payment_time: payment_time ? new Date(payment_time) : new Date(),
        error_message: error_message || ''
      },
      { new: true }
    );

    if (!updated) {
      console.warn('⚠️ No matching order found for collect_request_id:', collect_request_id);
    } else {
      console.log('✅ Order updated via webhook:', collect_request_id);
    }

    return res.status(200).json({ message: 'Webhook processed successfully', updated });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};

module.exports = {
  paymentWebhook
};
