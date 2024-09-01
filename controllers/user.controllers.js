import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const uploadData= async(req,res)=>{
    const{email, fullName, password}=req.body;
    if((!email||!fullName||!password)===""){
        res.status(400).json("Field cant be empty")
    }
    const userData=await User.create({
        email:email.toLowerCase(),
        fullName,
        password
    })
    if(!userData){
        res.status(400).json("Something went wrong while sending data to database")
    }
    res.status(201).json("User created succesfully")
    
}
export {uploadData}