const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const Product = require('../models/Product');

// Home Page – Show all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('customer/home', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
});

// Product Details Page
router.get('/product/:id', customerController.productDetails);

// Add to Cart (via Controller)
router.post('/cart/add/:id', customerController.addToCart);

// View Cart
router.get('/cart', customerController.viewCart);

// Checkout Form
router.get('/checkout', customerController.checkoutForm);

// Place Order
router.post('/orders', customerController.placeOrder);

// View Past Orders
router.get('/orders', customerController.viewOrders);

router.get('/about', (req, res) => {
  res.render('customer/about');
});

router.get('/contact', (req, res) => {
  res.render('customer/contact');
});

// (Optional: handle form submit from contact)
router.post('/contact', (req, res) => {
  // Save or send message logic here
  res.redirect('/contact');
});


// Alternate Add to Cart (Direct via Route)
router.post('/add-to-cart/:id', async (req, res) => {
  const productId = req.params.id;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  const existingProduct = req.session.cart.find(p => p._id == productId);

  if (!existingProduct) {
    try {
      const product = await Product.findById(productId);
      if (product) {
        req.session.cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
    } catch (err) {
      console.error(err);
      req.flash('error', 'Error adding product to cart');
      return res.redirect('/');
    }
  } else {
    existingProduct.quantity += 1;
  }

  req.flash('success', 'Product added to cart!');
  res.redirect('/');
});

module.exports = router;
