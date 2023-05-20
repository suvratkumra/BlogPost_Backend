const { Router } = require("express");
const User = require("../model/model");
const bcrypt = require("bcrypt");
const protected = require("../utils/protected")

const userRouter = Router();

// use this to test if the api is working or not
userRouter.get("/info", async (req, res) => {
    console.log(req.session);
    res.send("This is from the user router")
})

// get all users
userRouter.get("/all", async (req, res) => {
    try {

        const users = await User.find();
        res.status(200).json({
            status: "Approved",
            users: users
        });
    } catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later..."
        })
    }

})


// create a new user to the database.
userRouter.post("/create", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        // encrypting the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            email,
            username,
            "password": hashedPassword
        });
        console.log(user);
        res.status(200).json({
            status: "Approved",
            user: user
        });
    }
    catch (err) {
        res.status(400).json({ status: "Rejected", error: "You are not passing right arguments." });
    }

})

// login 
userRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const userFound = await User.findOne({ "username": username });
        if (userFound) {
            // get the password.
            const passwordMatches = await bcrypt.compare(password, userFound.password);
            if (passwordMatches) {
                // add this to session details
                req.session.loginAuth = userFound._id;
                // this means they are authorized to log in
                res.status(200).json({ status: "Approved", user: userFound });
            }
            else {
                res.status(400).json({ status: "Rejected", error: "Incorrect Login credentials." })
            }
        }
        else {
            res.status(400).json({ status: "Rejected", error: "Incorrect Login credentials." })
        }
    }
    catch (err) {
        res.status(400).json({ status: "Rejected", error: "Incorrect Login credentials." })
    }

})

// get the user profile
userRouter.get("/profile", protected, async (req, res) => {
    try {

        // get the information about the user using their id.
        const userInfo = await User.findById(req.session.loginAuth);
        if (userInfo) {
            res.status(200).json({
                status: "Approved",
                user: userInfo
            });
        }
    }
    catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later..."
        })
    }
})

// get the profile using id
userRouter.get("/profile/:id", async (req, res) => {
    try {

        // get the information about the user using their id.
        const userInfo = await User.findById(req.params.id);
        console.log(userInfo);
        if (userInfo) {
            res.status(200).json({
                status: "Approved",
                user: userInfo
            });
        }
    } catch (err) {
        res.status(400).json({
            status: "Rejected",
            message: "Invalid ID"
        })
    }
})

userRouter.put("/update", protected, async (req, res) => {
    try {
        // get the updating field from the user in the rq.body
        const { email, username } = req.body;


        // get the id from the session id
        const userId = req.session.loginAuth;

        const user = await User.findByIdAndUpdate(userId, {
            email,
            username,
        })

        res.status(200).json({
            status: "Approved",
            user: user
        })

    } catch (err) {
        res.status(500).json({
            status: "Rejected",
            message: "Server Error"
        })
    }
})


// logout
userRouter.get("/logout", protected, async (req, res) => {
    try {
        // delete the session keys so that the user's id is lost
        req.session.destroy(err => { console.log(err) });
        res.status(200).json({ status: "Approved", message: "You have been logged out" });
    }
    catch (err) {
        res.status(400).json({ status: "Rejected", message: "There was some error logging you out, try again." });
    }
})



// export so that our server can use it.
module.exports = userRouter;