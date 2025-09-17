// import mongoose
const mongoose=require('mongoose')
const schema=mongoose.Schema

const UserSchema=schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    student_id: { type: String, required: true, unique: true },
})

const Users=mongoose.model('Users',UserSchema)

module.exports=Users