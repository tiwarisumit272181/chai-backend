import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser=asyncHandler(
    async (req,res)=>{
        // get user detail 
        // validation 
        // check if user already exist
        // check for image check for avatar
        //upload them to cludinary and get link
        // check wheter you got avatar or not in link 
        // now create user object
        // check if user created 
        // remove passwrod and refrsh token 
        // return  the user res
        // if error send error 
        //1)
        const {fullName,username,password,email}=req.body
        //2)
        if([fullName,username,password,email].some(
            field=>field?.trim()===""
        )){
          throw new ApiError(400,"all field are compulsory")
        }

        const existedUser=await User.findOne(
            {
                $or:[{username},{email}]
            }
        )
        if(existedUser){
            throw new ApiError(409,"user with this email or username alredy exist")
        }
        // because we can not pass photos and other things directly so we have taken help of multer 
        // so multer added some functionality to request object
       console.log(req.files);
        const avatarLocalPath=req.files?.avatar[0]?.path
        // const coverImageLocalPath=req.files?.coverImage[0]?.path
        let coverImageLocalPath;
        if(req.files&&Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
            coverImageLocalPath=req.files.coverImage[0].path
        }
        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar is required ")
        }
        const avatar=await uploadOnCloudinary(avatarLocalPath);
        const coverImage=await uploadOnCloudinary(coverImageLocalPath);
        if(!avatar){
            throw new ApiError(400,"avatar is required")
        }
        // now we have everything now we can make in databse
        const user=await User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url||"",
            email,
            password,
            username:username.toLowerCase()
        })
        const createdUser=await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if(!createdUser){
            throw new ApiError(500,"something went wrong while registering the user");
        }
        return res.status(201).json(
            new ApiResponse(200,createdUser,"userRegisterd succesfully")
        )

    
    }
)
export {registerUser}