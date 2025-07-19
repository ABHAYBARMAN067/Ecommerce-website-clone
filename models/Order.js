const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: String
  },
  address: String,
  total: Number,
  status: {
    type: String,
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
