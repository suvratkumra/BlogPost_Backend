const { Router } = require("express");
const User = require("../model/model");
const bcrypt = require("bcrypt");


const userRouter = Router();

// use this to test if the api is working or not
userRouter.get("/info", async (req, res) => {
    res.send("This is from the user router")
})

// create a new user to the database.
userRouter.post("/create-user", async (req, res) => {
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

// export so that our server can use it.
module.exports = userRouter;