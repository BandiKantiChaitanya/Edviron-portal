const Orders = require("../models/orderSchema");
const OrderStatus = require("../models/orderStatusSchema");
const { createCollectRequest } = require("../utils/paymentAPi");
const jwt = require('jsonwebtoken');
const axios = require('axios');

const createOrder = async (req, res) => {
  try {
    const { school_id, trustee_id, student_info, gateway_name, amount } = req.body;

    if (!school_id || !student_info || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Save order to DB
    const order = await Orders.create({
      school_id,
      trustee_id,
      student_info,
      gateway_name
    });

    // 2. Generate payment link using external API
    const callback_url = "http://localhost:5173/payment-status"; // replace with your frontend
    const payment = await createCollectRequest({
      school_id,
      amount: String(amount),
      callback_url
    });
    // console.log(payment)
    // 3. Save OrderStatus with initial status 'pending'
    await OrderStatus.create({
      collect_id: order._id,
      collect_request_id: payment.collect_request_id,
      order_amount: Number(amount),
      transaction_amount: 0,
      payment_mode: "",
      payment_details: "",
      bank_reference: "",
      payment_message: "",
      status: "pending",
      error_message: "",
      payment_time: null,
      payment_url: payment.collect_request_url
    });

    // 4. Send response back to frontend
    res.status(200).json({
      message: "Payment link created",
      payment_url: payment.collect_request_url,
      collect_request_id: payment.collect_request_id
    });

  } catch (error) {
    console.error("Payment creation failed:", error?.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong while creating order" });
  }
};


const getStudentTransactions = async (req, res) => {
  const studentId = req.user.student_id;

  try {
    const transactions = await Orders.aggregate([
      {
        $match: {
          'student_info.id': studentId
        }
      },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'transaction_status'
        }
      },
      {
        $unwind: '$transaction_status'
      },
      {
        $project: {
          collect_id: '$_id',
          collect_request_id: '$transaction_status.collect_request_id',
          school_id: 1,
          gateway_name: 1,
          student_info: 1,
          order_amount: '$transaction_status.order_amount',
          transaction_amount: '$transaction_status.transaction_amount',
          status: '$transaction_status.status',
          payment_url: '$transaction_status.payment_url',
          payment_time: '$transaction_status.payment_time',
        //   payment_url: '$transaction_status.payment_url'
        }
      }
    ]);

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get student transactions' });
  }
};


const getAllOrdersStatus = async (req, res) => {
  try {
    const orders = await OrderStatus.find()
      .populate('collect_id')  // Optional: populate order details if needed
      .sort({ createdAt: -1 }); // Latest orders first

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const checkAndUpdatePaymentStatus = async (req, res) => {
  const { collect_request_id } = req.body;
  const school_id='65b0e6293e9f76a9694d84b4'

  if (!collect_request_id || !school_id) {
    return res.status(400).json({ error: 'Missing collect_request_id or school_id' });
  }

  try {
    // 1. Fetch existing transaction
    const existing = await OrderStatus.findOne({ collect_request_id });

    if (!existing) {
      return res.status(404).json({ error: 'OrderStatus not found for the given collect_request_id' });
    }

    // 2. If already SUCCESS, skip update
    if (existing.status === 'SUCCESS') {
      return res.status(200).json({
        message: 'Transaction already marked as SUCCESS. No update performed.',
        updatedStatus: existing
      });
    }

    // 3. Create `sign` token
    const signPayload = { school_id,collect_request_id };
    const signToken = jwt.sign(signPayload, process.env.PG_KEY); // Ensure PG_KEY is in .env

    // 4. Make API call
    const url = `https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}?school_id=${school_id}&sign=${encodeURIComponent(signToken)}`;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}` // This is your Edviron API key
      }
    });

    const data = response.data;

    // // 5. Update order status in DB
    const updated = await OrderStatus.findOneAndUpdate(
      { collect_request_id }, // match using collect_request_id
      {
        status: data.status || 'pending', // e.g., SUCCESS
        transaction_amount: data.amount || 0,
        payment_mode: data.details?.payment_mode || '',
        payment_details: data.details?.payment_details || '',
        bank_reference: data.details?.bank_reference || '',
        payment_message: data.details?.payment_message || '',
        payment_time: new Date(),
        error_message: data.error_message || ''
      },
      { new: true }
    );

    

   return res.status(200).json({ message: 'Payment status updated in DB',updatedStatus: updated});

  } catch (error) {
    console.error("Full error:", error);
  console.error("Response from edviron if any:", error.response?.data);
   return  res.status(500).json({ error: "Failed to check payment status" });
  }
};


module.exports = {
  createOrder,
  getStudentTransactions,
  getAllOrdersStatus,
  checkAndUpdatePaymentStatus
};
