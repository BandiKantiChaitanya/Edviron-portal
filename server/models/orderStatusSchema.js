// import mongoose
const mongoose=require('mongoose')
const schema=mongoose.Schema

const orderStatusSchema = new schema({
  collect_id: {
    type: mongoose.Schema.Types.ObjectId, // must match `_id` of order
    required: true,
    ref: 'Orders'
  },
  collect_request_id: {
    type: String, // This is Edviron's ID — REQUIRED!
    required: true,
    index: true
  },
   
  order_amount: {
    type: Number,
    required: true
  },
  transaction_amount: {
    type: Number,
    default: 0
  },
  payment_mode: {
    type: String,
    default: ""
  },
  payment_details: {
    type: String,
    default: ""
  },
  bank_reference: {
    type: String,
    default: ""
  },
  payment_message: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "pending"
  },
  error_message: {
    type: String,
    default: ""
  },
  payment_time: {
    type: Date,
    default: null
  },
  payment_url:{
    type:String,
    default:""
  }
}, { timestamps: true });


const orderStatus=mongoose.model('orderStatus',orderStatusSchema)

module.exports=orderStatus