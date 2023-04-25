const express=require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const postRoute=require('./routes/posts');
const cors=require('cors');
// const cookieParser=require('cookie-parser');

//creating env
dotenv.config();
//Import Routes
const authRoute=require('./routes/auth');
//connect to DB
mongoose.connect(process.env.DB_CONNECT,{dbName:""});
// app.use(cookieParser());

app.use(cors());

//Middleware
app.use(express.json());


// app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);
app.use("/",authRoute);
app.listen(3002,()=>console.log('Server is Running'));