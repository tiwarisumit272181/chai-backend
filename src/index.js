// we will make connection using mongoose so mongoose is required here 
//require('dotenv').config({path:'./env'}) //here we are importing in different manner this will consistancy so we do have to cahbfe in package.json file
import dotenv from "dotenv" //but we can use this with experimental feature
import connectDB from './db/index.js';
import { app } from "./app.js";
dotenv.config({
    path:"./.env"
})
connectDB().then(
    app.listen(process.env.PORT||8000,()=>{
        console.log(`your app is listinig on port no ${process.env.PORT||8000}`)
    })
)
.catch((error)=>{
  console.log('error in database connection !!!',error)
})




















/*
import { DB_NAME } from './constants';
import express from "express"
const app=express()
// function connectDb(){}
// connectDb()   we will use ifif here 
; (async ()=>{
    try {
         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
         app.on("error",(error)=>{
               console.log('Errror:' , error)
               throw error
         })
         app.listen(process.env.PORT,()=>{
            console.log(`you app is listening on port no ${process.env.PORT}`)
         })
    } catch (error) {
         console.log("Error : ",error)
         throw error
    }
})()
*/