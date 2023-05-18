const express = require('express');
const app = express();

const homePageController = async (req, res) => {
    try{
         res.render('home');
    }
    catch(err)
    {
        res.json({msg: "Error occured"});
    }
}

module.exports = homePageController;