import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js"
import catchAsynchErrors from "./catchAsynchErrors.js"

//Checks if user is authenticated or not 

export const isAuthenticatedUser = catchAsynchErrors(async(req, res, next) => {
    const {token} = req.cookies;

    if(!token) {
        return next(new ErrorHandler("Login first to acces this resource", 401));
    }

   const decoded = jwt.verify(token, process.env.JWT_SECRET)
   req.user = await User.findById(decoded.id)


    next();
});



//Authorize user roles

export const authorizeRoles = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not alowed to access this resource`, 403));
        }
        next();
    };
};