import express from "express"
import "dotenv/config"
import mongoose, { connect }  from "mongoose"
import { connctDb } from "./public/database/dab_connect.js"
import { uploadData } from "./public/controllers/user.controllers.js"
import userRouter from "./public/routes/userRouter.js"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
const app = express()
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const port=process.env.PORT|| 5000

// app.get("/",(req,res)=>{
//     res.json("hello world")
// })
app.use(express.static("public"))
app.use("/user",userRouter);
connctDb().then(()=>{
   
app.listen(port,(req,res)=>{
    console.log("Server running at",port)

})})
.catch((error)=>{
    console.log("An error occured")
})