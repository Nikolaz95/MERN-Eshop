
import catchAsynchErrors from "../middlewares/catchAsynchErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";
import {delete_file, upload_file} from "../utils/cloudinary.js"


// Register user =>  /api/v1/register
export const registerUser = catchAsynchErrors(async(req, res, next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
        name, 
        email, 
        password,
    });

    

    sendToken(user, 201, res)
});



// LogIn user =>  /api/v1/login
export const loginUser = catchAsynchErrors(async(req, res, next) => {
    const {email, password} = req.body;

    console.log("Received email:", email);
    console.log("Received password:", password);



    if(!email || !password) {
        return next(new ErrorHandler('Please enter your email & password', 400))
    }


    //Find user in the database
    const user = await User.findOne({email}).select("+password");


    if(!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    //Check if password is correct
    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 200, res)
});


// Logout user =>  /api/v1/logout
export const logout = catchAsynchErrors(async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        message: "Logged Out",
    });
});


// Upload user avatar =>  /api/v1/me/upload_avatar
export const uploadAvatar = catchAsynchErrors(async(req, res, next) => {
    
    const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");


    //Remove previous avatar
    if(req?.user?.avatar?.url) {
        await delete_file(req?.user?.avatar?.public_id);
    }

    const user = await User.findByIdAndUpdate(req?.user?._id, {
        avatar: avatarResponse,
    });

    res.status(200).json({
        user,
    });
});



// forgot password  =>  /api/v1/password/forgot
export const forgotPassword = catchAsynchErrors(async(req, res, next) => {

    //Find user in the database
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    //get reset password token
    const resetToken=  user.getResetPasswordToken()

    await user.save();

    //create reset password url

    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        await sendEmail({
          email: user.email,
          subject: "ShopIT Password Recovery",
          message,
        });
    
        res.status(200).json({
          message: `Email sent to: ${user.email}`,
        });
      } catch(error) {
        user.resetPasswordToken= undefined;
        user.resetPasswordExpire= undefined; 

        await user.save();
        return next(new ErrorHandler(error?.message, 500));
    }

});


// reset password  =>  /api/v1/password/reset/:token
export const resetPassword = catchAsynchErrors(async(req, res, next) => {

    //hash the url token 

   const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired',
        400
        )
        );
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next ( 
            new ErrorHandler("Password does not match",400));
    }

    //Set the new password

    user.password = req.body.password

    user.resetPasswordToken= undefined;
        user.resetPasswordExpire= undefined; 

        await user.save();

        sendToken(user, 200, res);

});



// Get current user profile  =>  /api/v1/me
export const getUserProfile = catchAsynchErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id);
  
    res.status(200).json({
      user,
    });
  });
  

  // Update paswword  =>  /api/v1/password/update
export const updatePassword = catchAsynchErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id).select("+password");

    //check the previous  user password

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400))

    }

    user.password = req.body.password;
    user.save();
  
    res.status(200).json({
      success: true,
    });
  });




    // Update User Profile  =>  /api/v1/me/update
export const updateProfile = catchAsynchErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
    });
  
    res.status(200).json({
        user,
    });
  });



    // Get all users - admin   =>  /api/v1/admin/users
export const allUsers = catchAsynchErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        users,
    });
  });



      // Get  user details - admin   =>  /api/v1/admin/users/:id
export const getUserDetails = catchAsynchErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User not find with id: ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        user,
    });
  });





    // Update User Details - admin  =>  /api/v1/admin/user/:id
    export const updateUser = catchAsynchErrors(async (req, res, next) => {

        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        };
    
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
        });
      
        res.status(200).json({
            user,
        });
      });



    // Delete User - ADMIN  =>  /api/v1/admin/users/:id
    export const deleteUser = catchAsynchErrors(async (req, res, next) => {
        const user = await User.findById(req.params.id);
      
        if (!user) {
          return next(
            new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
          );
        }
      
        // Remove user avatar from cloudinary
        if (user?.avatar?.public_id) {
          await delete_file(user?.avatar?.public_id);
        }
      
        await user.deleteOne();
      
        res.status(200).json({
          success: true,
        });
      });

