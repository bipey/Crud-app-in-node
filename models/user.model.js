import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        min:8
    }
},
{timestamps:true})
export const User= mongoose.model("User",userSchema)