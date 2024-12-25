const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Subcategory = require("../models/subcategory.js");
const Category = require("../models/category.js");
const { uploadFileToS3 } = require("../utils/s3Utils");
const { Op } = require("sequelize");
const router = express.Router();


router.get("/subcategories", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.dataValues.id;
  
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
          status: sub.Category.status
        })),
      });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
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
  
      res.status(201).json({
        message: "Subcategory created successfully",
        subcategory: {
          id: subcategory.id,
          subcategoryName: subcategory.subcategoryName,
          categoryName: category.categoryName,
          sequence: subcategory.sequence,
          image: subcategory.image,
          status: category.status
        },
      });
    } catch (error) {
      console.error("Error creating subcategory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

  router.put("/subcategory/:id", authMiddleware, async (req, res) => {
    try {
      const subcategoryId = req.params.id;
      const { categoryId, subcategoryName, sequence, image } = req.body;
      const userId = req.user.dataValues.id;
  
      const existingSubcategory = await Subcategory.findOne({
        where: {
          id: subcategoryId,
          userId
        },
        include: [{
          model: Category,
          attributes: ["categoryName", "status"],
        }]
      });
  
      if (!existingSubcategory) {
        return res.status(404).json({ message: "Subcategory not found or unauthorized" });
      }
  
      if (categoryId) {
        const category = await Category.findOne({
          where: {
            id: categoryId,
            userId
          }
        });
  
        if (!category) {
          return res.status(404).json({ message: "Category not found or unauthorized" });
        }
      }
  
      const updateData = {
        subcategoryName,
        sequence,
        categoryId: categoryId || existingSubcategory.categoryId
      };
  
      if (image && image !== existingSubcategory.image) {
        const base64Image = image.split(";base64,").pop();
        const imageBuffer = Buffer.from(base64Image, "base64");
  
        const s3ImageUrl = await uploadFileToS3({
          originalname: `subcategory-${subcategoryId}-${Date.now()}.jpg`,
          buffer: imageBuffer,
          mimetype: "image/jpeg"
        }, "subcategory-images");
  
        updateData.image = s3ImageUrl;
      }
  
      await existingSubcategory.update(updateData);
  
      const updatedSubcategory = await Subcategory.findOne({
        where: {
          id: subcategoryId,
          userId
        },
        include: [{
          model: Category,
          attributes: ["categoryName", "status"],
        }],
        attributes: ["id", "subcategoryName", "sequence", "image", "categoryId"]
      });
  
      res.status(200).json({
        message: "Subcategory updated successfully",
        subcategory: {
          id: updatedSubcategory.id,
          subcategoryName: updatedSubcategory.subcategoryName,
          categoryName: updatedSubcategory.Category.categoryName,
          sequence: updatedSubcategory.sequence,
          image: updatedSubcategory.image,
          status: updatedSubcategory.Category.status
        }
      });
  
    } catch (error) {
      console.error("Error updating subcategory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.delete("/subcategory/:id", authMiddleware, async (req, res) => {
    try {
      const subcategoryId = req.params.id;
      const userId = req.user.dataValues.id;
  
      const subcategory = await Subcategory.findOne({
        where: {
          id: subcategoryId,
          userId
        }
      });
  
      if (!subcategory) {
        return res.status(404).json({
          message: "Subcategory not found or unauthorized"
        });
      }
  
      await subcategory.destroy();
  
      res.status(200).json({
        message: "Subcategory deleted successfully",
        subcategoryId: subcategoryId
      });
  
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  router.get("/subcategories/search", authMiddleware, async (req, res) => {
    try {
      const { query } = req.query;
      const userId = req.user.dataValues.id;
  
      console.log("Subcategory search query:", query);
      
      const searchConditions = {
        userId,
        [Op.or]: [
          {
            subcategoryName: {
              [Op.iLike]: `%${query}%`
            }
          }
        ]
      };
  
      const subcategories = await Subcategory.findAll({
        where: searchConditions,
        include: [{
          model: Category,
          attributes: ["categoryName", "status"],
          where: { userId }
        }],
        attributes: ["id", "subcategoryName", "sequence", "image", "categoryId"],
        order: [["sequence", "ASC"]]
      });
  
      res.status(200).json({
        message: "Subcategories searched successfully",
        subcategories: subcategories.map(subcategory => ({
          id: subcategory.id,
          subcategoryName: subcategory.subcategoryName,
          categoryName: subcategory.Category.categoryName,
          sequence: subcategory.sequence,
          image: subcategory.image,
          status: subcategory.Category.status
        }))
      });
  
    } catch (error) {
      console.error("Error searching subcategories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


module.exports = router;


