const { default: mongoose } = require("mongoose");
const database = require("../utils/dbConnect");

const userModel = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    comments: {
        type: Array
    },
    posts: {
        type: Array
    }
}); 

// adding the User model to our database.
const User = mongoose.model("User", userModel);

module.exports = User;

