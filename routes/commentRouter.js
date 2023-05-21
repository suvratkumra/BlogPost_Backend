const { Router } = require("express");
const protected = require("../utils/protected");
const parser = require("../utils/cloudinaryConnect");
const Post = require("../model/postModel");
const User = require("../model/userModel");
const Comment = require("../model/commentModel");
const { getAllCommentsCtrl, createCommentCtrl, getCommentByIdCtrl, deleteCommentByIdCtrl } = require("../controller/commentRouterCtrl");

const commentRouter = Router();

// use this to test if the api is working or not
commentRouter.get("/info", async (req, res) => {
    console.log(req.session);
    res.send("This is from the comment router")
})

// get all posts
commentRouter.get("/all", getAllCommentsCtrl);

// comment for the post with id in the arguments
commentRouter.post("/create/:id", protected, parser.single("file"), createCommentCtrl)

// Find the comment by id
commentRouter.get("/:id", getCommentByIdCtrl);

// User delete his own post
commentRouter.delete("/:id", protected, async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).json({
                status: "Client Error",
                message: "You did not provide any id",
            })
        }
        const commentDeleted = await Comment.findByIdAndDelete(req.params.id);
        if (!commentDeleted) {
            res.status(400).json({
                status: "Rejected",
                message: "Comment already deleted"
            });
        }
        else {
            res.status(200).json({
                status: "Approved",
                message: "Comment successfully deleted"
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later...",
            error: err
        })
    }
})


// export so that our server can use it.
module.exports = commentRouter;