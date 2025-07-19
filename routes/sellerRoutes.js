const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const isSeller = require('../middleware/isSeller');
const upload = require('../middleware/multer'); //  Cloudinary upload middleware

// All comments in Hindi removed, and emojis removed from Hinglish comments if any.
router.get('/dashboard', isSeller, sellerController.dashboard);

//  Add Product
router.get('/products/new', isSeller, sellerController.newProductForm);
router.get('/add-product', isSeller, sellerController.newProductForm); // Optional alias

router.post('/products', isSeller, upload.single('image'), sellerController.createProduct);
router.post('/add-product', isSeller, upload.single('image'), sellerController.createProduct); // Optional alias

//  Edit Product
router.get('/products/:id/edit', isSeller, sellerController.editProductForm);
router.get('/edit/:id', isSeller, sellerController.editProductForm); // Optional alias

// PUT route with upload middleware for image update (if image upload is expected)
router.put('/products/:id', isSeller, upload.single('image'), sellerController.updateProduct);
router.put('/edit/:id', isSeller, upload.single('image'), sellerController.updateProduct); // Optional alias

//  Manage Products
router.get('/products', isSeller, sellerController.manageProducts);

//  Delete Product

router.delete('/products/:id', isSeller, sellerController.deleteProduct);

//  View Orders
router.get('/orders', isSeller, sellerController.viewOrders);

module.exports = router;
