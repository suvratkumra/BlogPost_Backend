const express = require('express');
const User = require('../model/userModel');
const app = express();
const bcrypt = require('bcrypt')

const getAllUsersCtrl = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: "Approved",
            users: users
        });
    } catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later..."
        })
    }
}

const createNewUserCtrl = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        // encrypting the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            email,
            username,
            "password": hashedPassword
        });
        console.log(user);
        res.status(200).json({
            status: "Approved",
            user: user
        });
    }
    catch (err) {
        res.status(400).json({ status: "Rejected", error: "You are not passing right arguments." });
    }
}

const loginUserCtrl = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userFound = await User.findOne({ "username": username });
        if (userFound) {
            // get the password.
            const passwordMatches = await bcrypt.compare(password, userFound.password);
            if (passwordMatches) {
                // add this to session details
                req.session.loginAuth = userFound._id;
                // this means they are authorized to log in
                res.status(200).json({ status: "Approved", user: userFound });
            }
            else {
                res.status(400).json({ status: "Rejected", error: "Incorrect Login credentials." })
            }
        }
        else {
            res.status(400).json({ status: "Rejected", error: "Incorrect Login credentials." })
        }
    }
    catch (err) {
        res.status(400).json({ status: "Rejected", error: "Incorrect Login credentials." })
    }
}

const profileCtrl = async (req, res) => {
    try {

        // get the information about the user using their id.
        const userInfo = await User.findById(req.session.loginAuth);
        if (userInfo) {
            res.status(200).json({
                status: "Approved",
                user: userInfo
            });
        }
    }
    catch (err) {
        res.status(500).json({
            status: "Server Error",
            message: "Some server error detected, try again later..."
        })
    }
};

const profileByIdCtrl = async (req, res) => {
    async (req, res) => {
        try {

            // get the information about the user using their id.
            const userInfo = await User.findById(req.params.id);
            console.log(userInfo);
            if (userInfo) {
                res.status(200).json({
                    status: "Approved",
                    user: userInfo
                });
            }
        } catch (err) {
            res.status(400).json({
                status: "Rejected",
                message: "Invalid ID"
            })
        }
    }
}

const updateUserProfileCtrl = async (req, res) => {
    try {
        // get the updating field from the user in the rq.body
        const { email, username } = req.body;


        // get the id from the session id
        const userId = req.session.loginAuth;

        const user = await User.findByIdAndUpdate(userId, {
            email,
            username,
        })

        res.status(200).json({
            status: "Approved",
            user: user
        })

    } catch (err) {
        res.status(500).json({
            status: "Rejected",
            message: "Server Error"
        })
    }
}

const updateProfilePicCtrl = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                status: "Rejected",
                message: "No file submitted to upload"
            })
        }
        const user = await User.findByIdAndUpdate(req.session.loginAuth, {
            profilePic: req.file.path
        },
            {
                new: true
            });

        res.status(200).json({
            status: "Approved",
            message: "File uploaded successfully"
        })

    } catch (err) {
        res.json(err);
    }
}

const updateCoverPicCtrl = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                status: "Rejected",
                message: "No file submitted to upload"
            })
        }
        const user = await User.findByIdAndUpdate(req.session.loginAuth, {
            coverPic: req.file.path
        },
            {
                new: true
            });

        res.status(200).json({
            status: "Approved",
            message: "File uploaded successfully"
        })

    } catch (err) {
        res.json(err);
    }
};

const logoutCtrl = async (req, res) => {
    try {
        // delete the session keys so that the user's id is lost
        req.session.destroy(err => { console.log(err) });
        res.status(200).json({ status: "Approved", message: "You have been logged out" });
    }
    catch (err) {
        res.status(400).json({ status: "Rejected", message: "There was some error logging you out, try again." });
    }
};

module.exports = {
    getAllUsersCtrl, createNewUserCtrl, loginUserCtrl, profileCtrl, profileByIdCtrl,
    updateUserProfileCtrl, updateProfilePicCtrl, updateCoverPicCtrl, logoutCtrl
};