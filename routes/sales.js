const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');

// Create new sale (process transaction)
router.post('/', protect, async (req, res) => {
  try {
    const { items, subtotal, tax, discount, total, paymentMethod, amountPaid, customer } = req.body;

    // Calculate change
    const change = amountPaid - total;

    if (change < 0) {
      return res.status(400).json({ message: 'Insufficient payment' });
    }

    // Check if products are in stock
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}` 
        });
      }
    }

    // Create the sale
    const sale = await Sale.create({
      items: items.map(item => ({
        product: item.product,
        productName: item.productName,
        barcode: item.barcode,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      })),
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      amountPaid,
      change,
      customer: customer || null,
      cashier: req.user._id,
      cashierName: req.user.name
    });

    // Reduce product quantities
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } }
      );
    }

    // Update customer loyalty points if customer exists
    if (customer) {
      await Customer.findByIdAndUpdate(customer, {
        $inc: { 
          totalPurchases: total,
          loyaltyPoints: Math.floor(total / 10)
        }
      });
    }

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all sales
router.get('/', protect, async (req, res) => {
  try {
    const sales = await Sale.find({})
      .populate('customer', 'name phone')
      .populate('cashier', 'name')
      .sort({ createdAt: -1 });
    
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single sale
router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer', 'name phone')
      .populate('cashier', 'name');
    
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get daily report
router.get('/reports/daily', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await Sale.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalTransactions = sales.length;

    res.json({
      date: today,
      totalSales,
      totalTransactions,
      sales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;