const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
  region: 'ap-south-1', // e.g., 'us-west-2'
});

// Generate unique file name for S3
const generateUniqueFileName = (originalName) => {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const uniqueSuffix = crypto.randomBytes(8).toString('hex');
  return `${baseName}-${uniqueSuffix}${ext}`;
};

// Upload to S3
const uploadFileToS3 = async (file, folderName) => {
  const uniqueFileName = generateUniqueFileName(file.originalname);
  const params = {
    Bucket: 'blog-images-kidiloski',
    Key: `${folderName}/${uniqueFileName}`, // Folder structure in S3
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const uploadImgToS3Command = new PutObjectCommand(params);
  await s3.send(uploadImgToS3Command);

  return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`; // Return the S3 URL
};

module.exports = {
  uploadFileToS3,
};
