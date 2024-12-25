const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Subcategory = require("../models/subcategory.js");
const Category = require("../models/category.js");
const { uploadFileToS3 } = require("../utils/s3Utils");
const router = express.Router();

// Create subcategory
router.post("/subcategory", authMiddleware, async (req, res) => {
  try {
    const { categoryId, subcategoryName, sequence, status, image } = req.body;
    const userId = req.user.dataValues.id;

    console.log("FROM CATEGORY.........", req.body, req.user);
    
    // Verify that the category exists and belongs to the user
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found or unauthorized" });
    }

    let s3ImageUrl = null;
    if (image) {
      // Convert the base64 image string to a buffer
      const base64Image = image.split(";base64,").pop();
      const imageBuffer = Buffer.from(base64Image, "base64");

      // Upload the image to S3
      s3ImageUrl = await uploadFileToS3(
        {
          originalname: "subcategory-image.jpg",
          buffer: imageBuffer,
          mimetype: "image/jpeg",
        },
        "subcategory-images"
      );
    }

    // Create the subcategory record with userId
    const subcategory = await Subcategory.create({
      categoryId,
      subcategoryName,
      sequence,
      status,
      image: s3ImageUrl,
      userId, // Add userId when creating
    });

    res.status(201).json({
      message: "Subcategory created successfully",
      subcategory: {
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        subcategoryName: subcategory.subcategoryName,
        sequence: subcategory.sequence,
        image: subcategory.image,
        status: subcategory.status,
        userId: subcategory.userId,
      },
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all subcategories for a specific category
router.get("/subcategories/:categoryId", authMiddleware, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const userId = req.user.dataValues.id;

    // Verify that the category belongs to the user
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found or unauthorized" });
    }

    // Fetch subcategories
    const subcategories = await Subcategory.findAll({
      where: { 
        categoryId,
        userId, // Add userId to ensure we only get user's subcategories
      },
      attributes: ["id", "subcategoryName", "sequence", "image", "status", "userId"],
    });

    res.status(200).json({
      message: "Subcategories fetched successfully",
      subcategories,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all subcategories across all user's categories
router.get("/subcategories", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.dataValues.id;

    // Fetch subcategories for the user directly
    const subcategories = await Subcategory.findAll({
      where: { userId }, // Filter by userId directly
      include: [{
        model: Category,
        attributes: ["categoryName"],
        where: { userId }, // Ensure category also belongs to user
      }],
      attributes: ["id", "subcategoryName", "sequence", "image", "status", "categoryId", "userId"],
    });

    res.status(200).json({
      message: "Subcategories fetched successfully",
      subcategories: subcategories.map(sub => ({
        id: sub.id,
        categoryId: sub.categoryId,
        categoryName: sub.Category.categoryName,
        subcategoryName: sub.subcategoryName,
        sequence: sub.sequence,
        image: sub.image,
        status: sub.status,
        userId: sub.userId,
      })),
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;