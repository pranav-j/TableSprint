// const express = require("express");
// const authMiddleware = require("../middleware/authMiddleware");
// const fs = require("fs");
// const path = require("path");
// const Category = require("../models/category.js");
// const router = express.Router();

// router.post("/category", authMiddleware, async (req, res) => {
//   try {
//     const { categoryName, categorySequence, status, image } = req.body;
//     console.log("FROM CATEGORY.........", req.body, req.user);

//     // Decode the base64 image and save it to the server
//     const base64Image = image.split(";base64,").pop();
//     const imagePath = path.join(__dirname, "../uploads", `${Date.now()}.png`);
//     fs.writeFileSync(imagePath, base64Image, { encoding: "base64" });

//     // Create the category record in the database
//     const category = await Category.create({
//       categoryName,
//       categorySequence,
//       status,
//       imagePath,
//       userId: req.user.dataValues.id,
//     });

//     console.log("CREATED category.............", category);
    

//     res.status(201).json({
//       message: "Category created successfully",
//       category: {
//         id: category.id,
//         categoryName: category.categoryName,
//         categorySequence: category.categorySequence,
//         image: category.imagePath,
//         status: category.status,
//       },
//     });
//   } catch (error) {
//     console.error("Error creating category:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// module.exports = router;


// ---------------------------------------------------------------------------------------------------------------------

// const express = require("express");
// const authMiddleware = require("../middleware/authMiddleware");
// const Category = require("../models/category.js");
// const router = express.Router();

// router.post("/category", authMiddleware, async (req, res) => {
//   try {
//     const { categoryName, categorySequence, status, image } = req.body;
//     console.log("FROM CATEGORY.........", req.body, req.user);

//     // You can directly store the base64 image string in the DB
//     // Just ensure that you're sending the image in the correct base64 format
//     const base64Image = image.split(";base64,").pop(); // Remove any metadata prefix if present

//     // Create the category record in the database
//     const category = await Category.create({
//       categoryName,
//       categorySequence,
//       status,
//       image: base64Image, // Store the base64 string directly
//       userId: req.user.dataValues.id,
//     });

//     console.log("CREATED category.............", category);

//     res.status(201).json({
//       message: "Category created successfully",
//       category: {
//         id: category.id,
//         categoryName: category.categoryName,
//         categorySequence: category.categorySequence,
//         image: category.image, // Returning the base64 image string
//         status: category.status,
//       },
//     });
//   } catch (error) {
//     console.error("Error creating category:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// module.exports = router;



const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Category = require("../models/category.js");
const { uploadFileToS3 } = require("../utils/s3Utils"); // Import the utility function for uploading to S3
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
        image: category.image, // Returning the S3 URL
        status: category.status,
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
