const multer = require('multer');
const { storage } = require('../utils/cloudinaryConfig');

const upload = multer({ storage }); // Upload middleware for Cloudinary

module.exports = upload;
