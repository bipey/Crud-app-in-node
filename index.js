import express from "express"
import "dotenv/config"
import mongoose, { connect }  from "mongoose"
import { connctDb } from "./database/dab_connect.js"
import { uploadData } from "./controllers/user.controllers.js"
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// app.get("/",(req,res)=>{
//     res.json("hello world")
// })

connctDb().then(()=>{
    app.post('/',(req,res)=>{
        uploadData(req,res)
    })
app.listen(8000,(req,res)=>{
    console.log("Server running at 8000")

})})
.catch((error)=>{
    console.log("An error occured")
})