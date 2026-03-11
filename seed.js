const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Customer = require('./models/Customer');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@grocery.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Cashier',
    email: 'cashier@grocery.com',
    password: 'cashier123',
    role: 'cashier',
  },
];

const products = [
  {
    name: 'White Bread',
    barcode: '1234567890001',
    category: 'Bakery',
    price: 2.99,
    costPrice: 1.50,
    quantity: 50,
    minStockLevel: 10,
    unit: 'piece',
    supplier: 'Local Bakery',
  },
  {
    name: 'Milk 1L',
    barcode: '1234567890002',
    category: 'Dairy',
    price: 3.49,
    costPrice: 2.00,
    quantity: 30,
    minStockLevel: 15,
    unit: 'l',
    supplier: 'Dairy Farm Co.',
  },
  {
    name: 'Coca Cola 2L',
    barcode: '1234567890003',
    category: 'Beverages',
    price: 2.49,
    costPrice: 1.20,
    quantity: 100,
    minStockLevel: 20,
    unit: 'l',
    supplier: 'Beverage Distributors',
  },
  {
    name: 'Potato Chips',
    barcode: '1234567890004',
    category: 'Snacks',
    price: 1.99,
    costPrice: 0.80,
    quantity: 75,
    minStockLevel: 25,
    unit: 'pack',
    supplier: 'Snack Foods Inc.',
  },
  {
    name: 'Fresh Apples',
    barcode: '1234567890005',
    category: 'Fruits',
    price: 4.99,
    costPrice: 2.50,
    quantity: 40,
    minStockLevel: 10,
    unit: 'kg',
    supplier: 'Fresh Farms',
  },
];

const customers = [
  {
    name: 'Alice Johnson',
    phone: '1234567890',
    loyaltyPoints: 150,
  },
  {
    name: 'Bob Smith',
    phone: '9876543210',
    loyaltyPoints: 200,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});

    console.log('Creating users...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    await User.insertMany(hashedUsers);

    console.log('Creating products...');
    await Product.insertMany(products);

    console.log('Creating customers...');
    await Customer.insertMany(customers);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Login credentials:');
    console.log('Admin: admin@grocery.com / admin123');
    console.log('Cashier: cashier@grocery.com / cashier123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedDatabase();