const asyncHandler=(requestHandler)=>{
   return  (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}
export {asyncHandler}
// try catch wala 

// const asyncHandler=(fn)=>{
//     return async (req,res,next)=>{
//         try {
//             await fn(req,res,error);   
//         } catch (error) {
//             res.status(err.code||500).json({
//                 success:false,
//                 message:err.message
//             })
//         }
//     }
// }

//promises wala ho to 
