// This is the backend server
const express = require('express');
const app = express();

// middlewares
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    res.render("home");
})

app.listen(3000 || process.env.PORT, ()=>console.log("Server connected"))
