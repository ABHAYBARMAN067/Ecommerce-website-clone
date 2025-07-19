const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');
const { cloudinary } = require('../utils/cloudinaryConfig');

module.exports = {
  // Show Login Page
  loginForm: (req, res) => {
    res.render('auth/login');
  },

  // Handle Login
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    req.flash('success', 'Logged in successfully');

    // After successful login, set session.role to 'seller' if user has both roles
    if (user.role === 'seller' && user.isCustomer) {
      req.session.role = 'seller';
    } else {
      req.session.role = user.role;
    }

    res.redirect(user.role === 'seller' ? '/seller/dashboard' : '/');
  },

  // Show Register Page
  registerForm: (req, res) => {
    res.render('auth/register');
  },

  // Handle Register
  registerUser: async (req, res) => {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash('error', 'User already exists');
      return res.redirect('/auth/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    req.flash('success', 'Registered successfully. Please login.');
    res.redirect('/auth/login');
  },

  // Logout
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  },

  // Delete User and all their products/images
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      // Find all products by this user
      const products = await Product.find({ seller: userId });
      // Delete images from Cloudinary
      for (const product of products) {
        if (product.image) {
          // Extract public_id from image URL
          const publicIdMatch = product.image.match(/ecommerce-app\/([^\.\/]+)\./);
          if (publicIdMatch) {
            const publicId = `ecommerce-app/${publicIdMatch[1]}`;
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }
      // Delete products from DB
      await Product.deleteMany({ seller: userId });
      // Delete user from DB
      await User.findByIdAndDelete(userId);
      req.flash('success', 'User and all their products/images deleted.');
      res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      req.flash('error', err.message || 'Failed to delete user and their data.');
      res.redirect('/admin/users');
    }
  }
};
