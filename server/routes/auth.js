/**
 * auth.js includes routes for user authentication, such as signup, login, and logout.
 * These routes manage user accounts and access control within the application.
 */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./../model/user");
const isAuthenticated = require("../middlewares/isAuthenticated");
const generateToken = require('../utils/generateToken');

//signup api
router.post("/signup", async (req, res) => {
    console.log("Signup request received");
    try {
        const {name, email, password} = req.body;
        console.log(req.body);
        console.log(`Received user data: name=${name}, email=${email}`);

        if (!password) {
            console.log("Password is required");
            return res
                .status(400)
                .json({status: "FAIL", message: "Password is required"});
        }
        if (!name) {
            console.log("Username is required");
            return res
                .status(400)
                .json({status: "FAIL", message: "Username is required"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully");

        let user = await User.findOne({email});
        if (user) {
            console.log("User already exists");
            return res.json({
                status: "FAIL",
                message: "User already exists for the Email Id.",
            });
        } else {
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            });
            await newUser.save();
            console.log("New user created successfully");

            // Generate JWT
            const jwToken = generateToken(newUser);
            console.log("JWT token generated successfully");

            return res.json({token: jwToken});
        }
    } catch (error) {
        console.error("Error in signup:", error);
        return res
            .status(500)
            .json({message: "An error occurred", error: error.message});
    }
});

//login api
router.post("/login", async (req, res) => {
    console.log("Login request received");
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (user) {
            console.log("User found, checking password");
            const passwordMatched = await bcrypt.compare(password, user.password);

            if (passwordMatched) {
                console.log("Password matched, generating token");
                const jwToken = generateToken(user);
                console.log("JWT token generated successfully");

                return res.json({token: jwToken});
            } else {
                console.log("Incorrect password");
                res.json({
                    status: "FAIL",
                    message: "Incorrect password",
                });
            }
        } else {
            console.log("User does not exist");
            res.json({
                status: "FAIL",
                message: "User does not exist for this Email Id",
            });
        }
    } catch (error) {
        console.error("Error in login:", error);
        res.json({
            status: "FAIL",
            message: "Something went wrong",
            error,
        });
    }
});
// logout api
router.post("/logout", (req, res) => {
    console.log("Logout request received");
    res.status(200).json({message: "Logged out successfully"});
});

//isloggedin api
router.get("/isloggedin", isAuthenticated, (req, res) => {
    console.log("IsLoggedIn request received");
    if (req.user) {
        console.log("User is logged in");
        res.json({
            isLoggedIn: true,
            user: {user: req.user},
        });
    } else {
        console.log("User is not logged in");
        res.json({isLoggedIn: false});
    }
});

module.exports = router;
