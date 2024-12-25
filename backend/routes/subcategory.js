const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Subcategory = require("../models/subcategory.js");
const Category = require("../models/category.js");
const { uploadFileToS3 } = require("../utils/s3Utils");
const router = express.Router();


router.get("/subcategories", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.dataValues.id;
  
      // Fetch subcategories for the user directly
      const subcategories = await Subcategory.findAll({
        where: { userId },
        include: [{
          model: Category,
          attributes: ["categoryName", "status"],
          where: { userId },
        }],
        attributes: ["id", "subcategoryName", "sequence", "image", "categoryId"],
      });
  
      res.status(200).json({
        message: "Subcategories fetched successfully",
        subcategories: subcategories.map(sub => ({
          id: sub.id,
          subcategoryName: sub.subcategoryName,
          categoryName: sub.Category.categoryName,
          sequence: sub.sequence,
          image: sub.image,
          status: sub.Category.status // Use category's status
        })),
      });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create subcategory
  router.post("/subcategory", authMiddleware, async (req, res) => {
    try {
      const { categoryId, subcategoryName, sequence, image } = req.body;
      const userId = req.user.dataValues.id;
  
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
        const base64Image = image.split(";base64,").pop();
        const imageBuffer = Buffer.from(base64Image, "base64");
        s3ImageUrl = await uploadFileToS3(
          {
            originalname: "subcategory-image.jpg",
            buffer: imageBuffer,
            mimetype: "image/jpeg",
          },
          "subcategory-images"
        );
      }
  
      const subcategory = await Subcategory.create({
        categoryId,
        subcategoryName,
        sequence,
        image: s3ImageUrl,
        userId,
      });
  
      // Return simplified response with category's status
      res.status(201).json({
        message: "Subcategory created successfully",
        subcategory: {
          id: subcategory.id,
          subcategoryName: subcategory.subcategoryName,
          categoryName: category.categoryName,
          sequence: subcategory.sequence,
          image: subcategory.image,
          status: category.status // Use category's status
        },
      });
    } catch (error) {
      console.error("Error creating subcategory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  


module.exports = router;








