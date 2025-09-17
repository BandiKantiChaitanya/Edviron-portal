// import mongoose
const mongoose=require('mongoose')
const schema=mongoose.Schema

const orderSchema=schema({
    school_id:{
        type:String,
        required:true
    },
    trustee_id :{
        type:String,
        required:true
    },
    student_info:[
        {
            name:String, 
            id:String,
            email:String
        }
    ],
    gateway_name:{
        type:String,
        required:true
    }
},{ timestamps: true })

const Orders=mongoose.model('Orders',orderSchema)

module.exports=Orders