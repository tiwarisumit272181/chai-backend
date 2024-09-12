import {v2 as cloudinary} from 'cloudinary';
import fs from  'fs'
    // Configuration
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,  // Click 'View API Keys' above to copy your API secret
    });
    
    const uploadOnCloudinary=async(localFilePath)=>{
        try {
            if(!localFilePath) return null
            // upload the file in cloudinary
            const response=await cloudinary.uploader.upload(localFilePath,{
              resource_type:"auto"  
            })    
            // file has been uploade succesfuly
            console.log("file is uploaded on cloudinary",response.url)
            fs.unlinkSync(localFilePath) 
            return response;

        } catch (error) {
            fs.unlinkSync(localFilePath) // remove the locally saved temproary file as the upload opeartion failed
            return null
        }
        
    }

    export {uploadOnCloudinary}