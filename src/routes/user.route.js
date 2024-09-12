import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=Router()
router.route("/register").post( upload.fields([
    {
        name:'avatar',
        maxCount:1
    },
    {
        name:'coverImage',
        maxCount:1
    }
]) ,registerUser)   // here i will write middle so that raw data can be handelled but the phot things will not be hanndelled currectlt so fro that we will apply multer middle ware 
export default router;
// now here complete parsing of user detail will be done normal data will be pass by default and to 
// handel photo i used multer here 
// now i will write validation of these 
