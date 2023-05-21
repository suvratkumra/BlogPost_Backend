const Post = require("../model/postModel");
const User = require("../model/userModel");
const Comment = require("../model/commentModel");
const protected = require("../utils/protected");
const parser = require("../utils/cloudinaryConnect");

const getAllCommentsCtrl = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json({
            status: "Approved",
            comments: comments
        });
    } catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later..."
        })
    }
};

const createCommentCtrl = async (req, res) => {
    try {
        const { comment } = req.body;
        const id = req.params.id;
        const userID = req.session.loginAuth;
        // create the post
        const comment_ = await Comment.create({
            comment,
            postId: id,
            userId: userID
        })

        // update the user
        const user = await User.findById(userID);

        // access the posts field of this user
        const currentComments = user.comments;
        user.comments.push(comment_._id);

        await user.save();

        // save the comment in the post as well
        const post = await Post.findById(id);
        post.comments.push(comment_._id);
        await post.save();

        res.status(200).json({
            status: "Approved",
            comment_: comment_
        })
    } catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later..."
        })
    }
};

const getCommentByIdCtrl = async (req, res) => {
    try {
        const commentId = req.params.id;

        // find the post by id from the databse
        const post = await Comment.findById(commentId)/*.populate("userId")*/;

        if (!post) {
            res.status(400).json({
                status: "Client Error",
                message: `Comment with id:${req.params.id} not found`,
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
};

const deleteCommentByIdCtrl = async (req, res) => {
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
};

module.exports = { getAllCommentsCtrl, createCommentCtrl, deleteCommentByIdCtrl, getCommentByIdCtrl, }
