import express from "express"
import cors from "cors"
import coockieParser from "cookie-parser"
const app=express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
})) 
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,
    limit:'16kb'
}))
app.use(express.static("public"))
app.use(coockieParser())

// routes import 
import UserRouter from "./routes/user.route.js"
app.use('/api/v1/user',UserRouter);


export {app};
