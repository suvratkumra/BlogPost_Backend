const { Router } = require("express");

const userRouter = Router();

// use this to test if the api is working or not
userRouter.get("/info", async(req, res)=>{
    res.send("This is from the user router")
})

module.exports = userRouter;