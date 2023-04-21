const express=require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const postRoute=require('./routes/posts');
//creating env
dotenv.config();
//Import Routes
const authRoute=require('./routes/auth');
//connect to DB
mongoose.connect(process.env.DB_CONNECT,{dbName:""});

//Middleware
app.use(express.json());


app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);
app.use("/",authRoute);
app.listen(3000,()=>console.log('Server is Running'));