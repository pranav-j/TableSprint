const express = require("express");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {    
    const { userName, email, password } = req.body;

    console.log({ userName, email, password });

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = User.hashPassword(password);
        const user = await User.create({ username: userName, email, password: hashedPassword });
        console.log("Signup succesfull.................", user);
        
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Logging in....................");
    
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !User.validatePassword(password, user.password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.TWT_SECRET, { expiresIn: "24h" });

        res.cookie('authToken', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            secure: false,
            sameSite: 'strict',
            maxAge: 72000000 
        });

        res.status(200).json({ 
            message: "Login successful", 
            username: user.username 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
