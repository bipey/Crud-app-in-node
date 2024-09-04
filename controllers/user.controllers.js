import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import  jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";


//generate access and refresh token
const generateAccessRefreshToken=async(userId)=>{
    const LoggedUser=await User.findById(userId)
    const accessToken=await LoggedUser.generateAccessToken()
    const refreshToken=await LoggedUser.generateRefreshToken()
    LoggedUser.refreshToken=refreshToken
await LoggedUser.save()
return {accessToken,refreshToken}
}


//create operation
const uploadData= async(req,res)=>{
    const{email, fullName, password, confirmPassword}=req.body;
    
    if((!email||!fullName||!password)===""){
        return res.status(400).json("Field cant be empty")
    }
    const checkEmail=await User.findOne({email:email.toLowerCase()})
    if(checkEmail){
        console.log(checkEmail)
        return res.status(400).json("Email already exists")
    }
    if(password.length<8){
        return res.status(400).json("Password should be of minimum 8 characters")
    }
    if(password!=confirmPassword){
        return res.status(400).json("Passwords doesnt match")
    }
    const userData=await User.create({
        email:email.toLowerCase(),
        fullName,
        password
    })
    if(!userData){
        return res.status(400).json("Something went wrong while sending data to database")
    }
   return res.status(201).json("User created succesfully")
    
}


//update operation
 const updateData=async(req,res)=>{
    const {email, updatedName}=req.body;
    console.log(email,updatedName)
   
    try {
        const updateUser= await User.findOneAndUpdate({ //can use updateOne, updateMany, findAndUpdate, findByIdAndUpdate
            email:email,
        },
    {
        $set:{
            fullName: updatedName
        },
        
    },
    {
        ignoreUndefined: false
    }
        )
    if(!updateUser){
        return res.status(500).json("Error occured while updating")
    }
    return res.status(200).json("Updated succesfully")
    } catch (error) {
        console.log("Error occured",error)
    }
 }
 


 
 //read operation
 const readData = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json("Email is required");
    }

    try {
        const readUser = await User.find({ email: email.toLowerCase() }).select("fullName email password"); //can use findone, findById
        // to find third document that matches the email
        //const readUser = await User.find({ email: email.toLowerCase() })
        // .select("fullName email password")
        // .skip(2) // Skip the first 4 documents
        // .limit(1); // Limit the result to 1 document
         if (!readUser) {
           return res.status(404).json("No user found with that email");
    }

        // console.log(readUser);
        // console.log(User.countDocuments())

        return res.status(200).json(readUser); // Return the user data
    } catch (error) {
        console.error("Error occurred during reading data:", error);
        return res.status(500).json("Server error");
    }
};




   //delete operation
   
   const deleteData= async(req,res)=>{
    const {email}=req.body;
    try {

      const deleteUser= await User.findOneAndDelete({email:email.toLowerCase()}).select("fullName, password, email")
      console.log(deleteUser)
      if(!deleteUser){
              return res.status(404).json("User not found ")
          }
          return res.status(200).json("User data deleted")
        }
      
     
   catch (error) {
    return res.status(500).json("Server error occured while deleteing data")
  }
   }




// login function

const userLogin= async(req,res)=>{
    const {email, password}=req.body
    const isUserRegistered= await User.findOne({email:email})
    if(!isUserRegistered){
        return res.status(401).json("User is not registered")
    }
    const checkPassword= await isUserRegistered.comparePassword(password)
    if(!checkPassword){
        return res.status(401).json("Wrong password")
    }
    const{accessToken,refreshToken}=await generateAccessRefreshToken(isUserRegistered._id);
    // console.log(accessToken,"\n", refreshToken)
    const cookieOptions={
    httpOnly:true, //the cookie cant be ready by client
    secure:true
}

     res.status(200)
    .cookie("AccessToken",accessToken,cookieOptions)  //setting the cookies
    .cookie("RefreshToken",refreshToken,cookieOptions)
    .json("Welcome user")
    const getCookies= req.cookies
    // console.log(getCookies)    //getting the cookies
    // console.log(getCookies['Refresh Token'])
}
const logoutUser= async (req,res)=>{
    // console.log(req.loggedInUser._id)
    if (!req.loggedInUser || !req.loggedInUser._id) {
        return res.status(401).json("User not authenticated");
    }
   const loggedInUser=req.loggedInUser

   loggedInUser.refreshToken = undefined;
   await loggedInUser.save();

    const cookieOptions={
        httpOnly:true,
        secure:true
    }
    return res.status(201)
    .clearCookie("AccessToken",cookieOptions)
    .clearCookie("RefreshToken",cookieOptions)
    .json("User Logged Out")
}


//Refreshing access Token
const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.RefreshToken || req.body.refreshToken;
        
        if (!incomingRefreshToken) {
            return res.status(401).json("Unauthorized request");
        }

        // Verify the incoming refresh token
        const decodedRefreshToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedRefreshToken._id);
        
        if (!user) {
            return res.status(401).json("Invalid token");
        }

        // Log tokens for comparison
        // console.log("Incoming refresh token:", incomingRefreshToken);
        // console.log("Stored refresh token:", user.refreshToken);

        // Ensure the incoming token matches the one in the database
        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json("Refresh token expired or used");
        }

        // Generate new tokens
        const { accessToken, refreshToken:newRefreshToken } = await generateAccessRefreshToken(user._id);
        // console.log("New refresh token:", newRefreshToken);
        // console.log(accessToken)

        // Update user's refresh token and save
        // user.refreshToken = newRefreshToken;
        // await user.save();

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,  // Set to false for local testing if not using HTTPS
        };

        res.status(201)
            .cookie("AccessToken", accessToken, cookieOptions)
            .cookie("RefreshToken", newRefreshToken, cookieOptions)
            .json("Token refreshed");

    } catch (error) {
        console.log("Error occurred while decoding the tokens:", error.message);
        return res.status(500).json("Internal Server Error");
    }
};


 //exporting the functions
export {uploadData, updateData, readData, deleteData, userLogin, logoutUser, refreshAccessToken}