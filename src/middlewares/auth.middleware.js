import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) =>{
    try {
        const accessToken = await req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!accessToken){
            throw new ApiError(401, "Unothorized request");
        }
    
        const decodedUser = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedUser._id).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(401, "Invalid access token");
        }
    
        req.user = user;
    
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "invalid access token");
    }

})