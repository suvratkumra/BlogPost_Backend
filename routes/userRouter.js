const { Router } = require("express");
const User = require("../model/model");
const bcrypt = require("bcrypt");


const userRouter = Router();

// use this to test if the api is working or not
userRouter.get("/info", async (req, res) => {
    console.log(req.session);
    res.send("This is from the user router")
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

// export so that our server can use it.
module.exports = userRouter;