// This is the backend server
const express = require('express');
const parser = require('./utils/cloudinaryConnect');
const app = express();

const homePageController = require('./controller/routerController');

// starting the db.
const connect = require('./utils/dbConnect');

connect();

// middlewares
app.use(express.json());

// so that we can render client side pages. 
app.set("view engine", "ejs");

app.use(express.static("public"));


app.get("/", homePageController);

// app.post("/post", parser.single('image'), async (req, res) => {
//     // res.render("home");
//     res.json(req.file);
// })

app.listen(3000 || process.env.PORT, ()=>console.log("Server connected"))
