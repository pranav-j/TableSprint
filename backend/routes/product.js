const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/product.js");
const Category = require("../models/category.js");
const Subcategory = require("../models/subcategory.js");
const { uploadFileToS3 } = require("../utils/s3Utils");
const router = express.Router();

// Get all products for a user
router.get("/products", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.dataValues.id;

    const products = await Product.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          attributes: ["categoryName"],
          where: { userId },
        },
        {
          model: Subcategory,
          attributes: ["subcategoryName"],
          where: { userId },
        },
      ],
      attributes: [
        "id",
        "productName",
        "image",
        "categoryId",
        "subcategoryId",
        "status"
      ],
    });

    res.status(200).json({
      message: "Products fetched successfully",
      products: products.map(product => ({
        id: product.id,
        productName: product.productName,
        categoryName: product.Category.categoryName,
        subcategoryName: product.Subcategory.subcategoryName,
        image: product.image,
        status: product.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create product
router.post("/product", authMiddleware, async (req, res) => {
  try {
    const { categoryId, subcategoryId, productName, image } = req.body;
    const userId = req.user.dataValues.id;

    console.log("ADDING product========================", {categoryId, subcategoryId, productName});
    

    // Verify category and subcategory belong to user
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId,
      },
    });

    const subcategory = await Subcategory.findOne({
      where: {
        id: subcategoryId,
        categoryId,
        userId,
      },
    });

    if (!category || !subcategory) {
      return res
        .status(404)
        .json({ message: "Category or subcategory not found or unauthorized" });
    }

    let s3ImageUrl = null;
    if (image) {
      const base64Image = image.split(";base64,").pop();
      const imageBuffer = Buffer.from(base64Image, "base64");
      s3ImageUrl = await uploadFileToS3(
        {
          originalname: "product-image.jpg",
          buffer: imageBuffer,
          mimetype: "image/jpeg",
        },
        "product-images"
      );
    }

    const product = await Product.create({
      categoryId,
      subcategoryId,
      productName,
      image: s3ImageUrl,
      userId,
      status: "Active" // Default status
    });

    res.status(201).json({
      message: "Product created successfully",
      product: {
        id: product.id,
        productName: product.productName,
        categoryName: category.categoryName,
        subcategoryName: subcategory.subcategoryName,
        image: product.image,
        status: product.status,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;