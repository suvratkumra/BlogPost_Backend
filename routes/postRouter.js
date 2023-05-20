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
        const post = await Post.findById(postId).populate("userId");

        if (!post) {
            res.status(400).json({
                status: "Client Error",
                message: `Post with id:${req.params.id} not found`,
            })
        }
        else {
            res.status(200).json({
                status: "Approved",
                post: post
            });

        }

    }
    catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later...",
            error: err
        })
    }
});

// User delete his own post
postRouter.delete("/:id", protected, async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).json({
                status: "Client Error",
                message: "You did not provide any id",
            })
        }
        const postDeleted = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "Approved",
            message: "Post successfully deleted"
        });
    } catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later...",
            error: err
        })
    }
})

// User able to update his own post.
postRouter.put("/:id", protected, parser.single("file"), async (req, res) => {
    try {
        const { caption, subcaption } = req.body;
        // console.log(caption, subcaption);
        const postId = req.params.id;
        const updatedPost = await Post.findByIdAndUpdate(postId, {
            file: req.file.path,
            caption,
            subcaption
        },
            {
                new: true
            });
        console.log(updatedPost);
        if (!updatedPost) {
            res.status(400).json({
                status: "Client Error",
                message: "Could not update the properties. Some error occured.",
            })
        }
        else {
            res.status(200).json({
                status: "Approved",
                message: "Post successfully updated",
                post: updatedPost
            });
        }
    }
    catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later...",
            error: err
        })
    }
})

// export so that our server can use it.
module.exports = postRouter;