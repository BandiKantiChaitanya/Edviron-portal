// import express
const express=require('express')
const { createOrder,getStudentTransactions, getAllOrdersStatus, checkAndUpdatePaymentStatus } = require('../controllers/orderControllers')
const auth = require('../middlewares/auth')
const orderStatus = require('../models/orderStatusSchema')
const Orders = require('../models/orderSchema')
const orderRouter=express.Router()

orderRouter.post('/createOrder',createOrder)

orderRouter.get('/transactions/student',auth, getStudentTransactions)

orderRouter.get('/orders',getAllOrdersStatus)

orderRouter.post('/checkStatus',checkAndUpdatePaymentStatus)

// routes/schools.js or wherever
orderRouter.get('/schools', async (req, res) => {
   try {
    const schools = await Orders.distinct('school_id');
    res.json({message:'hi',schools});
  } catch (error) {
    console.error('Error fetching school IDs:', error);
    res.status(500).json({ message: 'Failed to fetch school IDs' });
  }
});

module.exports=orderRouter
