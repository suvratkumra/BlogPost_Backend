const protected = require("../utils/protected");
const { Router } = require("express");
const parser = require("../utils/cloudinaryConnect");
const { updatePostByIdCtrl, deletePostByIdCtrl, findPostByIdCtrl, createPostCtrl, getAllPostsCtrl } = require("../controller/postRouterCtrl");

const postRouter = Router();

// use this to test if the api is working or not
postRouter.get("/info", async (req, res) => {
    console.log(req.session);
    res.send("This is from the post router")
})

// get all posts
postRouter.get("/all", getAllPostsCtrl);

postRouter.post("/create", protected, parser.single("file"), createPostCtrl)

// Find the post by id
postRouter.get("/:id", findPostByIdCtrl);

// User delete his own post
postRouter.delete("/:id", protected, deletePostByIdCtrl)

// User able to update his own post.
postRouter.put("/:id", protected, parser.single("file"), updatePostByIdCtrl)

// export so that our server can use it.
module.exports = postRouter;