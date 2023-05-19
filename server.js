// This is the backend server

// Before everything we need to have our dotenv
const dotenv = require('dotenv');
dotenv.config();

const MongoStore = require('connect-mongo');

const express = require('express');
const parser = require('./utils/cloudinaryConnect');
const app = express();

// creating the session so that the server can remember the user
const session = require('express-session');

app.use(session({
    secret: "HelloThisIsTheSecret",
    resave: true,
    saveUninitialized: true,
    // store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}))
const homePageController = require('./controller/routerController');

// starting the db.
const connect = require('./utils/dbConnect');
const bodyParser = require('body-parser');

connect();

// middlewares
app.use(express.json());

// so that we can render client side pages. 
app.set("view engine", "ejs");

app.use(express.static("public"));

// for post requests
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", homePageController);

app.post("/login", async (req, res) => {
    if(!req.session.loginUser)
    {
        res.status(400).json({msg: "Error you are not authorized"});
    }
    else 
    {
        res.send("You are authorized, go ahead, go bananas.");
    }
    console.log(req.session);
})

// app.post("/post", parser.single('image'), async (req, res) => {
//     // res.render("home");
//     res.json(req.file);
// })

app.listen(3000 || process.env.PORT, ()=>console.log("Server connected"))
