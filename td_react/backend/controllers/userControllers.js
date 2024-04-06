const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require('bcrypt')
const UserOTP = require("../models/otpModel")

//====================================================================================


const nodemailer = require('nodemailer')
require('dotenv').config()
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.USER,
      pass: process.env.PASSWORD
    },
  });



//====================================================================================


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
    // COMMENTX from backend when we throw error, frontend can receive it if we try catch the error(see Login.js where we display toast error)
  }
});

const createOTP = asyncHandler(async (req, res) => {
  
    const {email, password} = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    

    try {
        await sendVerificationOTPEmail({email},res);
        res.json({
            email:email,
            password:password,
        });
    } catch (e) {
        throw new Error(e.message)
    }


});


const sendVerificationOTPEmail = async({email},res)=>{
    try{
        const otp = `${Math.floor(1000 + Math.random()*9000)}`;

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: "Verify your email",
            html: `<p>Enter <b>${otp}</b> in the app to verify account creation</p>`
        }

        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp,saltRounds);
        const findEmail = await UserOTP.find({email:email})
        let otpverification = null;
        if(findEmail.length>=1){
            otpverification = await UserOTP.findOneAndUpdate({email:email},{otp:hashedOTP,createdAt:Date.now(),expiredAt:Date.now() + 25000})
        }else{
            otpverification = new UserOTP({email:email,otp:hashedOTP,createdAt:Date.now(),expiredAt:Date.now() + 30000});
            await otpverification.save()
        }

        
        await transporter.sendMail(mailOptions);

    }catch(e){
        throw new Error(e)
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const {email,password,formOTP} = req.body;

    const otpVerificationRecord = await UserOTP.find({email:email})

    if(otpVerificationRecord.length<=0){
        throw new Error("U crazy");
    }else{
        const {otp,expiredAt} = otpVerificationRecord[0]
        console.log(Date.now())
        console.log(expiredAt)
        if(expiredAt < Date.now()){
            await UserOTP.deleteMany({email:email})
            await sendVerificationOTPEmail({email},res)
            res.status(400);
            throw new Error("OTP expired, resent OTP");
        }else{
            const validOTP = await bcrypt.compare(formOTP,otp);
            if(!validOTP){
                res.status(400);
                throw new Error("OTP incorrect");
            }else{
                    
                const user = await User.create({
                    name:email,
                    email:email,
                    password:password,
                });
                if (user) {
                    await UserOTP.deleteMany({email:email})
                    res.status(201).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        token: generateToken(user._id),
                    });
                } else {
                    res.status(400);
                    throw new Error("User not found");
                }
                
                
                
            }
        }
    }
});




module.exports = {createOTP,authUser,registerUser}