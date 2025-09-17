//  import express
const express=require('express')
const dotenv=require('dotenv')
const mongoose = require('mongoose')
const orderRouter = require('./routes/orderRoutes')
const userRouter = require('./routes/userRoutes')
const webhookRouter = require('./routes/webhookRoutes')
const cors=require('cors')

// initialize app
const app=express()

// cors
const allowedOrigins = [
  'https://edviron-portal.vercel.app',
  'https://edviron-portal-git-main-bandikantichaitanyas-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
    origin:  function(origin, callback){
    if(!origin) return callback(null, true); // allow REST clients like Postman
    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
    credentials:true
}))
// middleware
app.use(express.json())
dotenv.config()

app.use('/api',orderRouter)
app.use('/api',userRouter)
app.use('/webhook', express.json(), webhookRouter);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Connected to MongoDB')
})
.catch(err=>{
    console.log('Error occured')
})



const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})


