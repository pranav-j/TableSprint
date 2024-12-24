const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/category", authMiddleware, async(req, res) => {
    console.log("FROM CATEGORY.........");
    
})