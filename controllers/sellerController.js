const Product = require('../models/Product');
const Order = require('../models/Order');

module.exports = {
  //  Seller Dashboard
  dashboard: async (req, res) => {
    try {
      const products = await Product.find({ seller: req.session.userId });
      res.render('seller/dashboard', {
        title: 'Seller Dashboard',
        products
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading dashboard');
    }
  },

  //  Show Add Product Form
  newProductForm: (req, res) => {
    res.render('seller/addProduct', { title: 'Add Product' });
  },

  //  Handle Product Creation
  createProduct: async (req, res) => {
    try {
      const { name, price, description } = req.body;
      const product = new Product({
        name,
        price,
        description,
        image: req.file?.path || '',
        seller: req.session.userId
      });
      await product.save();
      req.flash('success', 'Product added successfully!');
      res.redirect('/seller/dashboard');
    } catch (err) {
      console.error(err);
      req.flash('error', err.message || 'Failed to add product');
      res.redirect('/seller/products/new');
    }
  },

  //  Manage Products
  manageProducts: async (req, res) => {
    try {
      const products = await Product.find({ seller: req.session.userId });
      res.render('seller/manageProducts', {
        title: 'Manage Products',
        products
      });
    } catch (err) {
      console.error(err);
      req.flash('error', err.message || 'Error loading products');
      res.status(500).send('Error loading products');
    }
  },

  //  Edit Product Form
  editProductForm: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect('/seller/products');
      }
      res.render('seller/editProduct', {
        product,
        title: 'Edit Product'
      });
    } catch (err) {
      console.error(err);
      req.flash('error', err.message || 'Error loading product');
      res.redirect('/seller/products');
    }
  },

  //  Update Product
  updateProduct: async (req, res) => {
    const { name, price, description } = req.body;
    const { id } = req.params;

    try {
      const updateData = { name, price, description };
      if (req.file) {
        updateData.image = req.file.path;
      }

      await Product.findByIdAndUpdate(id, updateData);
      req.flash('success', 'Product updated successfully!');
      res.redirect('/seller/dashboard');
    } catch (err) {
      console.error(err);
      req.flash('error', err.message || 'Failed to update product');
      res.redirect(`/seller/products/${id}/edit`);
    }
  },

  //  Delete Product
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      req.flash('success', 'Product deleted');
      res.redirect('/seller/dashboard');
    } catch (err) {
      console.error(err);
      req.flash('error', err.message || 'Failed to delete product');
      res.redirect('/seller/dashboard');
    }
  },

  //  View Orders
  viewOrders: async (req, res) => {
    try {
      const orders = await Order.find({});
      res.render('seller/viewOrders', {
        title: 'View Orders',
        orders
      });
    } catch (err) {
      console.error(err);
      req.flash('error', err.message || 'Error loading orders');
      res.status(500).send('Error loading orders');
    }
  }
};
