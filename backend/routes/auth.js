const express = require("express");
// const User = require("../models/User");
const User = require("../models/user.js")
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    console.log("Signup request.........................");
    
    const { userName, email, password } = req.body;

    console.log({ userName, email, password });

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = User.hashPassword(password);
        const user = await User.create({ username: userName, email, password: hashedPassword });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !User.validatePassword(password, user.password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, "your_jwt_secret", { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
