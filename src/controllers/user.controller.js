import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken= async (userId)=>{
     try {
        const user=await User.findById(userId);
        const accessToken=user.generateAcessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken   
        await user.save({validateBeforeSave:false}) // this is important step study about this
        return {accessToken,refreshToken};
     } catch (error) {
         throw new ApiError(500,"something went wrong while genearting access or refrsh token")
     }
}
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
const loginUser=asyncHandler(
    async (req,res)=>{
        //get the data
        // username or passwrod
        // find the user according to that
        // validate the password
        // access token and refresh toke genrate
        // save refresh toke to database
        // send all these in cookies
        const {email,username,password}=req.body;
        if(!username&&!email){
            throw new ApiError(400,"username or email is required");
        }
        // const user=await User.findOne({
        //     $for: [{email},{username}]
        //   }
        // )
        let user=undefined;
        if(username){
             user=await User.findOne({username:username});
        }
        else{
            user= await User.findOne({email:email});
        }
        // untile here corrosponding to that user no refresh toke there in database
        // console.log(user)
        if(!user){
            throw new ApiError(400,"user does not exist");
        }
        // now this is user instance of User
        const isPasswordValid=await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            throw new ApiError(401,"password incorrect")
        }
        // now hamne yahan tak tay kar liya hai now baari hai acces token aur refresh toke generate karke set karne ki 
        // kyonki ham is kaam ko baar baar karenge isliye ham iska ek ek alag function bana lete hain 
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
        const loggedInUser=await User.findById(user._id).select(
            "-password -refreshToken"  // this will remove the password and refreshToken field 
        )
        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                 { 
                  user:loggedInUser,refreshToken,accessToken
                 },
               "user loggedin succesfully"
           ))

    }
)
// to logout we have to go to database and correspomding to that refresh toke
// we have to delete and some other user related thongs we have to change but how 
// we will get to know like which user is there to logout 
// so for doing that we have to use middleware
// so here we will write our own middle ware

const logoutUser = async(req,res)=>{
   // usser_id kahan se leke aaun 
   // so we have mioddleware so what they willl do during coming 
   // they will also come with id so here we can get id and manipulate 
   await User.findByIdAndUpdate(
      req.user._id,
       {
        $set :{
           refreshToken:undefined
        }
       },
        {
            new:true
        }
      
   )

   // now cookies se bhi to hatana padega na 
   const options={
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"user logged out succesfully"))
    

}
    




export {registerUser
    ,loginUser,logoutUser
}