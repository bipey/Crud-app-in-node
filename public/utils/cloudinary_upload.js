import { v2 as cloudinary } from "cloudinary";
import "dotenv/config"
import fs from "fs";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_APIKEY,
    api_secret:process.env.CLOUDINARY_CLOUD_APISECRET

})

//UPLOAD ON CLOUDINARY

export const uploadImageOnCloudiary=async(localPath)=>{
    try {
        const uploadImg=await cloudinary.uploader.upload(localPath,{
            resource_type:'auto'
        })
     console.log("Image uploaded on cloudinary", uploadImg.url)
     return uploadImg
    } catch (error) {
        console.log("Error occured while uploading image", error.message);
        try {
            await fs.unlink(localPath)
            console.log(" File removed from local storage")
        } catch (error) {
            console.log("Error removing the image", error.message)
        }
        return null
    }   
}