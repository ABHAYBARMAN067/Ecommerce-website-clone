// External Modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Route Imports
const customerRoutes = require('./routes/customerRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const authRoutes = require('./routes/authRoutes');

// View Engine + Layout Setup
app.use(expressLayouts);
app.set('layout', 'boilerplate'); // views/boilerplate.ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Session Setup with MongoDB (7 Days)
app.use(
  session({
    secret: 'ecommerce_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 60 * 60 * 24 * 7, // 7 days
      autoRemove: 'native',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    },
  })
);

// Flash Messages
app.use(flash());

// Global Template Variables
app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  res.locals.cart = req.session.cart;
  res.locals.session = req.session;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    console.log('Connected to DB:', mongoose.connection.name);
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/seller', sellerRoutes);
app.use('/', customerRoutes);
app.use(express.static('public'));

// Home Route (if not handled by customerRoutes)
const Product = require('./models/Product');
app.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('customer/home', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading products');
  }
});

// Add to Cart (Only if logged in)
app.post('/cart/add', (req, res) => {
  if (!req.session.userId) {
    req.flash('error', 'Please login to add items to cart.');
    return res.redirect('/auth/login');
  }

  const { productId, name, price, quantity, image } = req.body;
  const qty = parseInt(quantity) || 1;

  const cart = req.session.cart || [];
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({
      productId,
      name,
      price: parseFloat(price),
      quantity: qty,
      image,
    });
  }

  req.session.cart = cart;
  req.flash('success', `${name} added to cart.`);
  res.redirect('/');
});

// View Cart
app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('customer/cart', { cart, total });
});

// 404 Page Not Found
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
