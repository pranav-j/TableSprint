const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/product.js");
const Category = require("../models/category.js");
const Subcategory = require("../models/subcategory.js");
const { uploadFileToS3 } = require("../utils/s3Utils");
const { Op } = require("sequelize");
const router = express.Router();


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

// Edit product
router.put("/product/:id", authMiddleware, async (req, res) => {
    try {
      const productId = req.params.id;
      const { categoryId, subcategoryId, productName, image, status } = req.body;
      const userId = req.user.dataValues.id;
  
      // First, check if the product exists and belongs to the user
      const existingProduct = await Product.findOne({
        where: {
          id: productId,
          userId
        },
        include: [
          {
            model: Category,
            attributes: ["categoryName"],
          },
          {
            model: Subcategory,
            attributes: ["subcategoryName"],
          }
        ]
      });
  
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found or unauthorized" });
      }
  
      // If categoryId is provided, verify it belongs to the user
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
  
      // If subcategoryId is provided, verify it belongs to the user and category
      if (subcategoryId) {
        const subcategory = await Subcategory.findOne({
          where: {
            id: subcategoryId,
            userId,
            categoryId: categoryId || existingProduct.categoryId
          }
        });
  
        if (!subcategory) {
          return res.status(404).json({ message: "Subcategory not found or unauthorized" });
        }
      }
  
      // Prepare update object
      const updateData = {
        productName,
        status,
        categoryId: categoryId || existingProduct.categoryId,
        subcategoryId: subcategoryId || existingProduct.subcategoryId
      };
  
      // Handle image update if new image is provided
      if (image && image !== existingProduct.image) {
        const base64Image = image.split(";base64,").pop();
        const imageBuffer = Buffer.from(base64Image, "base64");
  
        const s3ImageUrl = await uploadFileToS3({
          originalname: `product-${productId}-${Date.now()}.jpg`,
          buffer: imageBuffer,
          mimetype: "image/jpeg"
        }, "product-images");
  
        updateData.image = s3ImageUrl;
      }
  
      // Update the product
      await existingProduct.update(updateData);
  
      // Fetch the updated product to return in response
      const updatedProduct = await Product.findOne({
        where: {
          id: productId,
          userId
        },
        include: [
          {
            model: Category,
            attributes: ["categoryName"],
          },
          {
            model: Subcategory,
            attributes: ["subcategoryName"],
          }
        ],
        attributes: ["id", "productName", "image", "status"]
      });
  
      res.status(200).json({
        message: "Product updated successfully",
        product: {
          id: updatedProduct.id,
          productName: updatedProduct.productName,
          categoryName: updatedProduct.Category.categoryName,
          subcategoryName: updatedProduct.Subcategory.subcategoryName,
          image: updatedProduct.image,
          status: updatedProduct.status
        }
      });
  
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete product
  router.delete("/product/:id", authMiddleware, async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.user.dataValues.id;
  
      // Check if the product exists and belongs to the user
      const product = await Product.findOne({
        where: {
          id: productId,
          userId
        }
      });
  
      if (!product) {
        return res.status(404).json({
          message: "Product not found or unauthorized"
        });
      }
  
      // Delete the product
      await product.destroy();
  
      res.status(200).json({
        message: "Product deleted successfully",
        productId: productId
      });
  
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });



  router.get("/products/search", authMiddleware, async (req, res) => {
    try {
      const { query } = req.query;
      const userId = req.user.dataValues.id;
  
      const searchConditions = {
        userId,
        [Op.or]: [
          {
            productName: {
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
  
      const products = await Product.findAll({
        where: searchConditions,
        include: [
          {
            model: Category,
            attributes: ["categoryName"],
            where: { userId }
          },
          {
            model: Subcategory,
            attributes: ["subcategoryName"],
            where: { userId }
          }
        ],
        attributes: ["id", "productName", "image", "status"],
        order: [["productName", "ASC"]]
      });
  
      res.status(200).json({
        message: "Products searched successfully",
        products: products.map(product => ({
          id: product.id,
          productName: product.productName,
          categoryName: product.Category.categoryName,
          subcategoryName: product.Subcategory.subcategoryName,
          image: product.image,
          status: product.status
        }))
      });
  
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


module.exports = router;