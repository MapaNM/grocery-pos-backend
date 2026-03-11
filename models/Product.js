const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  barcode: {
    type: String,
    required: [true, 'Please add a barcode'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Beverages', 'Snacks', 'Dairy', 'Bakery', 'Fruits', 'Vegetables', 'Meat', 'Grocery', 'Personal Care', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  costPrice: {
    type: Number,
    required: [true, 'Please add a cost price'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: 0,
    default: 0
  },
  minStockLevel: {
    type: Number,
    default: 10,
    min: 0
  },
  unit: {
    type: String,
    default: 'piece',
    enum: ['piece', 'kg', 'g', 'l', 'ml', 'dozen', 'pack']
  },
  supplier: {
    type: String,
    default: 'N/A'
  },
  description: {
    type: String,
    maxlength: 500
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Check if stock is low
productSchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.minStockLevel;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);