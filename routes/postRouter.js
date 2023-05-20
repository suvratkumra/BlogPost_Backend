const { Router } = require("express");
const protected = require("../utils/protected");
const parser = require("../utils/cloudinaryConnect");
const Post = require("../model/postModel");
const User = require("../model/userModel");

const postRouter = Router();

// use this to test if the api is working or not
postRouter.get("/info", async (req, res) => {
    console.log(req.session);
    res.send("This is from the post router")
})

// get all posts
postRouter.get("/all", async (req, res) => {
    try {

        const posts = await Post.find();
        res.status(200).json({
            status: "Approved",
            posts: posts
        });
    } catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later..."
        })
    }
});

postRouter.post("/create", protected, parser.single("file"), async (req, res) => {
    try {
        const { caption } = req.body;
        const userID = req.session.loginAuth;
        // create the post
        const post = await Post.create({
            file: req.file.path,
            caption,
            userId: userID
        })

        // update the user
        const user = await User.findById(userID);

        // access the posts field of this user
        const currentPosts = user.posts;
        user.posts.push(post._id);

        await user.save();

        res.status(200).json({
            status: "Approved",
            post: post
        })
    } catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later..."
        })
    }
})

// Find the post by id
postRouter.get("/:id", async (req, res) => {
    try {
        const postId = req.params.id;

        // find the post by id from the databse
        const post = await Post.findById(postId);

        res.status(200).json({
            status: "Approved",
            post: post
        });

    }
    catch (Err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later..."
        })
    }
});

// export so that our server can use it.
module.exports = postRouter;