const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Category = require("../models/category.js");
const { uploadFileToS3 } = require("../utils/s3Utils"); 
const { Op } = require("sequelize");
const router = express.Router();

router.post("/category", authMiddleware, async (req, res) => {
  try {
    const { categoryName, sequence, status, image } = req.body;
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
      categorySequence: sequence,
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
          sequence: category.categorySequence,
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


  router.put("/category/:id", authMiddleware, async (req, res) => {
    try {
      const categoryId = req.params.id;
      const { categoryName, sequence, status, image } = req.body;

      console.log("cat UPDATION====================", { categoryName, sequence, status });
      
      
      // First, check if the category exists and belongs to the user
      const existingCategory = await Category.findOne({
        where: {
          id: categoryId,
          userId: req.user.dataValues.id
        }
      });
  
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found or unauthorized" });
      }
  
      // Prepare update object
      const updateData = {
        categoryName,
        categorySequence: sequence,
        status
      };
  
      // Handle image update if new image is provided
      if (image && image !== existingCategory.image) {
        // Convert the base64 image string to a buffer
        const base64Image = image.split(";base64,").pop();
        const imageBuffer = Buffer.from(base64Image, "base64");
  
        // Upload the new image to S3
        const s3ImageUrl = await uploadFileToS3({
          originalname: `category-${categoryId}-${Date.now()}.jpg`,
          buffer: imageBuffer,
          mimetype: "image/jpeg"
        }, "category-images");
  
        updateData.image = s3ImageUrl;
      }
  
      await existingCategory.update(updateData);
  
      // Fetch the updated category to return in response
      const updatedCategory = await Category.findOne({
        where: {
          id: categoryId,
          userId: req.user.dataValues.id
        },
        attributes: ["id", "categoryName", "categorySequence", "image", "status"]
      });
  
      res.status(200).json({
        message: "Category updated successfully",
        category: {
          id: updatedCategory.id,
          categoryName: updatedCategory.categoryName,
          sequence: updatedCategory.categorySequence,
          image: updatedCategory.image,
          status: updatedCategory.status,
        }
      });
  
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });



  router.delete("/category/:id", authMiddleware, async (req, res) => {
    try {
      const categoryId = req.params.id;
      
      // Check if the category exists and belongs to the user
      const category = await Category.findOne({
        where: {
          id: categoryId,
          userId: req.user.dataValues.id
        }
      });
  
      if (!category) {
        return res.status(404).json({ 
          message: "Category not found or unauthorized" 
        });
      }
  
      // Delete the category
      await category.destroy();
  
      res.status(200).json({
        message: "Category deleted successfully",
        categoryId: categoryId
      });
  
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/categories/search", authMiddleware, async (req, res) => {
    try {
      const { query } = req.query;

      console.log("query======================", query);
      
      
      const searchConditions = {
        userId: req.user.dataValues.id,
        [Op.or]: [
          {
            categoryName: {
              [Op.iLike]: `%${query}%`
            }
          },
          {
            status: {
              [Op.iLike]: `%${query}%`
            }
          }
        ]
      };
  
      const categories = await Category.findAll({
        where: searchConditions,
        attributes: ["id", "categoryName", "categorySequence", "image", "status"],
        order: [["categorySequence", "ASC"]]
      });
  
      res.status(200).json({
        message: "Categories searched successfully",
        categories: categories.map(category => ({
          id: category.id,
          categoryName: category.categoryName,
          sequence: category.categorySequence,
          image: category.image,
          status: category.status
        }))
      });
  
    } catch (error) {
      console.error("Error searching categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
