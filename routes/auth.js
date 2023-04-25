const router=require('express').Router();
const User=require('../model/User');
const bcrypt=require('bcryptjs');
const {registerValidation,loginValidation}=require('../validation')
const jwt=require('jsonwebtoken');




router.post('/register',async(req,res)=>{
//   validating data
const {error}=registerValidation(req.body);
if(error) return res.status(400).send(error.details[0].message);

//checking if user exists or not
const emailExist=await User.findOne({email:req.body.email});
if(emailExist){
      return res.status(400).send("Email already exists");
}

//Hash passwords
const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(req.body.password,salt);


//create a new user
      const user=new User({
    name:req.body.name,
    email:req.body.email,
    password:hashedPassword
   });
//saving data in db
   try{
         const savedUser=await user.save();
         res.send({user: user._id});
   }catch(err){
    res.status(400).send(err);
   }
});

router.post('/login',async(req,res)=>{
      const {error}=loginValidation(req.body);
      if(error) return res.status(400).send(error.details[0].message);
     //email exists
      const user=await User.findOne({email:req.body.email});
      if(!user){
            return res.status(400).send("Email does not exists");
      }
      //check if Password is correct
           const validPass=await bcrypt.compare(req.body.password,user.password);
           if(!validPass) return res.status(400).send('Invalid password');

           //create and assign jwt token
           const token=jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
           console.log(token);
           res.cookie('myCookie', token, {
            domain: 'course-app.onrender.com',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000 // Expires in 1 hour
          });
            res.send(token);
//   res
//     .cookie("access_token", token, {
//       domain: 'localhost',
//       path: '/',
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict'
//     })
//     .status(200)
//     .json({ message: "Logged in successfully 😊 👌" });
//       //      res.header('auth-token',token).send(token);

//       console.log(req.cookies.access_token);

});
router.get("/",(req,res)=>{
      res.send("Welcome to Jwt Authentication System ,Use Postman to register or login");
});




module.exports=router;