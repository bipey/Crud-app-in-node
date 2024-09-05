import { User } from "../models/user.model.js";
import {uploadImageOnCloudiary} from "../utils/cloudinary_upload.js"


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
    if (!req.file  ) {
        return res.status(400).json("Avatar image is required");
    }
    // console.log(req.file.avatar.filename)
    // const avatarLocalPath = req.files.avatar?.[0]?.path;
    // if(!avatarLocalPath){
    //     res.send({status:401, message:"Avatar image is required"})
    // }
    const avatarLocalPath=`./public/images/${req.file.filename}`
    const avatar= await uploadImageOnCloudiary(avatarLocalPath)

    const userData=await User.create({
        email:email.toLowerCase(),
        fullName,
        password,
        avatar:avatar.url
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



 //exporting the functions
export {uploadData, updateData, readData, deleteData}