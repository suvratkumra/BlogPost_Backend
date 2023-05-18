const express = require('express');
const app = express();

const homePageController = async (req, res) => {
    try{
        req.session.loginUser = "what the hell toby?";
        console.log(req.session);
         res.render('home');
    }
    catch(err)
    {
        res.json({msg: "Error occured"});
    }
}

module.exports = homePageController;