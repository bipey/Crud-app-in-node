import mongoose from "mongoose";
import { validate } from "email-validator";
import bcrypt from "bcrypt";

const userSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate: {
            validator: validate, // Use the validator library's isEmail function
            message: "Invalid email format",
        },
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    confirmPassword:{
        type:String,
     
    }
},
{timestamps:true})

//pre hooks executes before operation in db
userSchema.pre("save",async function(next){
    try {
     const emailValidator=validate(this.email)
     if(!emailValidator){
        next();
     }
    } catch (error) {
        console.log("Error occured while validation email")
        next();
    }
    if(!this.isModified("password")){ //CHECKS IF THE PASSWORD IS MODIFIED OR NOT, ONLY HASHES IF THE PW IS MODIFIED
        return next();
    }
    try {
        this.password=await bcrypt.hash(this.password,8)
    } catch (error) {
        console.log("Error occured while hashing passw0rd")
    }
    this.confirmPassword=undefined
    
})

// userSchema.pre("save",async function(next) {
//     if(!this.isModified("password")){ //CHECKS IF THE PASSWORD IS MODIFIED OR NOT, ONLY HASHES IF THE PW IS MODIFIED
//         return next();
//     }
//     try {
//         this.password=await bcrypt.hash(this.password,8)
//     } catch (error) {
//         console.log("Error occured while hashing passw0rd")
//     }
    
// })

//post hook occur after operation in db
userSchema.post("save",async function(){
    console.log("Data saved",this)
})
userSchema.post("updateOne",async function(){
    console.log("Db updated")
})
export const User= mongoose.model("User",userSchema)