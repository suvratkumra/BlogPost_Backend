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
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}))
const homePageController = require('./controller/userRouterCtrl');

// starting the db.
const connect = require('./utils/dbConnect');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const globalError = require('./errorHandling/globalErrorHandler');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');

connect();

// middlewares
app.use(express.json());

// so that we can render client side pages. 
app.set("view engine", "ejs");

app.use(express.static("public"));

// for post requests
app.use(bodyParser.urlencoded({ extended: true }));

// use the global error handler
app.use(globalError);

app.get("/home", (req, res) => {
    res.render("home");
})

// setting up all the endpoints for the users
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.listen(3000 || process.env.PORT, () => console.log("Server connected"))
