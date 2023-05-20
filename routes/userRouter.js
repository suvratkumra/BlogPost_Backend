const { Router } = require("express");
const User = require("../model/userModel")
const bcrypt = require("bcrypt");
const protected = require("../utils/protected");
const parser = require("../utils/cloudinaryConnect");
const Post = require("../model/postModel");
const { updateProfilePicCtrl, updateUserProfileCtrl, profileByIdCtrl, profileCtrl, loginUserCtrl, createNewUserCtrl, updateCoverPicCtrl, logoutCtrl, getAllUsersCtrl } = require("../controller/userRouterCtrl");


const userRouter = Router();

// use this to test if the api is working or not
userRouter.get("/info", async (req, res) => {
    console.log(req.session);
    res.send("This is from the user router")
})

// get all users
userRouter.get("/all", getAllUsersCtrl)


// create a new user to the database.
userRouter.post("/create", createNewUserCtrl)

// login 
userRouter.post("/login", loginUserCtrl)

// get the user profile
userRouter.get("/profile", protected, profileCtrl)

// get the profile using id
userRouter.get("/profile/:id", profileByIdCtrl)

userRouter.put("/update", protected, updateUserProfileCtrl)

// update profile picture
userRouter.put("/update/profile-pic", protected, parser.single('file'), updateProfilePicCtrl);

// update profile picture
userRouter.put("/update/cover-pic", protected, parser.single('file'), updateCoverPicCtrl);

// logout
userRouter.get("/logout", protected, logoutCtrl)



// export so that our server can use it.
module.exports = userRouter;