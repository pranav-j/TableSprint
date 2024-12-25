const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Category = require("../models/category.js");
const { uploadFileToS3 } = require("../utils/s3Utils"); 
const router = express.Router();

router.post("/category", authMiddleware, async (req, res) => {
  try {
    const { categoryName, categorySequence, status, image } = req.body;
    console.log("FROM CATEGORY.........", req.body, req.user);

    // Convert the base64 image string to a buffer
    const base64Image = image.split(";base64,").pop(); // Remove metadata from base64 string
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Upload the image to S3
    const s3ImageUrl = await uploadFileToS3({
      originalname: "category-image.jpg", // You can customize this if needed
      buffer: imageBuffer,
      mimetype: "image/jpeg" // You may want to determine this based on the actual image type
    }, "category-images"); // folderName for S3 bucket

    console.log("==============s3ImageUrl==============", s3ImageUrl);
    
    // Create the category record in the database with the S3 URL
    const category = await Category.create({
      categoryName,
      categorySequence,
      status,
      image: s3ImageUrl, // Store the S3 URL
      userId: req.user.dataValues.id,
    });

    console.log("CREATED category.............", category);

    res.status(201).json({
      message: "Category created successfully",
      category: {
        id: category.id,
        categoryName: category.categoryName,
        categorySequence: category.categorySequence,
        image: category.image,
        status: category.status,
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/categories", authMiddleware, async (req, res) => {
    try {
      // Fetch all categories associated with the authenticated user
      const categories = await Category.findAll({
        where: { userId: req.user.dataValues.id },
        attributes: ["id", "categoryName", "categorySequence", "image", "status"], // Select only required fields
      });
  
      // Transform the data if needed (optional in this case)
      const response = categories.map((category) => ({
        id: category.id,
        categoryName: category.categoryName,
        sequence: category.categorySequence,
        image: category.image, // S3 URL of the image
        status: category.status,
      }));
  
      res.status(200).json({
        message: "Categories fetched successfully",
        categories: response,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
