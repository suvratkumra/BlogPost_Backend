// This is the backend server
const express = require('express');
const app = express();

// starting the db.
const connect = require('./utils/dbConnect');

connect();

// middlewares
app.use(express.json());

// so that we can render client side pages. 
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    res.render("home");
})

app.listen(3000 || process.env.PORT, ()=>console.log("Server connected"))
