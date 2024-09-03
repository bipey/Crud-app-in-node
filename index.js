import express from "express"
import "dotenv/config"
import mongoose, { connect }  from "mongoose"
import { connctDb } from "./database/dab_connect.js"
import { uploadData } from "./controllers/user.controllers.js"
import userRouter from "./routes/userRouter..js"
import cookieParser from "cookie-parser"
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// app.get("/",(req,res)=>{
//     res.json("hello world")
// })
app.use("/user",userRouter);
connctDb().then(()=>{
   
app.listen(8000,(req,res)=>{
    console.log("Server running at 8000")

})})
.catch((error)=>{
    console.log("An error occured")
})