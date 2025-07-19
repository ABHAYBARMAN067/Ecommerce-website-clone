const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

module.exports = {
  // Home page: Show all products with existing sellers only
  homePage: async (req, res) => {
    // Populate seller and filter out products with missing seller
    const products = await Product.find({}).populate('seller');
    const filteredProducts = products.filter(p => p.seller !== null);
    res.render('customer/home', { products: filteredProducts });
  },

  // Product details page
  productDetails: async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('customer/productDetails', { product });
  },

  // Add to cart (session based)
  addToCart: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        if (!req.session.cart) {
          req.session.cart = [];
        }
        req.session.cart.push({
          id: product._id,
          name: product.name,
          price: product.price
        });
      }
      req.flash('success', 'Item added to cart!');
      res.redirect('/cart');
    } catch (err) {
      console.error(err);
      req.flash('error', err.message || 'Error adding product to cart');
      return res.redirect('/');
    }
  },

  // View cart
  viewCart: (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    res.render('customer/cart', { cart, total });
  },

  // Checkout form page
  checkoutForm: (req, res) => {
    res.render('customer/checkout');
  },

  // Place order logic
  placeOrder: async (req, res) => {
    const order = new Order({
      user: req.session.userId || 'Guest',
      total: 999,
      address: req.body.address,
      status: 'Processing'
    });
    await order.save();
    res.redirect('/orders');
  },

  // View orders
  viewOrders: async (req, res) => {
    const orders = await Order.find({});
    res.render('customer/orders', { orders });
  }
};
