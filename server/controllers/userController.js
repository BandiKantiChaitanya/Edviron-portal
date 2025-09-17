const Users = require("../models/userSchema")
const bcryptjs=require('bcryptjs')
const jwt = require("jsonwebtoken");


const createUser=async (req,res)=>{
    try {
        const {username,password,email,student_id}=req.body
        const user= await Users.findOne({email})
        // console.log(user)
        if(!user){
            const hashPassword=await bcryptjs.hashSync(password,10)
            const newUser=new Users({
                username,
                email,
                password:hashPassword,
                student_id
            })
            const response=await newUser.save()
           return  res.status(200).json({message:'User created Successfully',data:response})
        }else{
            return  res.status(400).json({message:'Email already exist'})
        }
        // if(user){
        // }
    } catch (error) {
        return res.status(500).json({message:'Server error occured while creating user'})
    }
}


const userLogin=async (req,res)=>{
    try {
        const {email,password}=req.body
        const user=await Users.findOne({email})
        // console.log(user)
        if(user){
            const cmpPassword=await bcryptjs.compareSync(password,user.password)
            if(cmpPassword){
                const token = jwt.sign({ student_id: user.student_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                // console.log(token)
                // res.json({ token });
                return res.status(200).json({message:'User LoggedIn',token})
            }else{
                return res.status(400).json({message:'Invalid Password'})
            }
        }else{
            return res.status(400).json({message:'Invalid Email'})
        }
    } catch (error) {
        res.status(500).json({message:'Server Error Occured while logging'})
    }
}

module.exports={
    createUser,
    userLogin
}