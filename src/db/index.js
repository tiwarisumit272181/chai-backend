import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
const connectDB= async ()=>{
  try {
    const connectInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\nmongoDb coneected !! ${connectInstance.connection.host}`)
  } catch (error) {
      console.log("error in making connection :",error);
      process.exit(1);
  }
};
export default connectDB