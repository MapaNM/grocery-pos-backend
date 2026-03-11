# 🛒 Grocery POS System - Backend

REST API backend for the Grocery POS system built with Node.js, Express, and MongoDB.

## 🚀 Features

- User authentication with JWT
- Product management with barcode support
- Sales transaction processing
- Customer management with loyalty points
- Daily sales reports
- Automatic inventory updates

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/grocery-pos
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRE=30d
```

### 4. Seed the database
```bash
node seed.js
```

This creates:
- 2 users (Admin & Cashier)
- 5 sample products
- 2 sample customers

### 5. Start the server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5001`

## 🔐 Default Login Credentials

**Admin:**
- Email: `admin@grocery.com`
- Password: `admin123`

**Cashier:**
- Email: `cashier@grocery.com`
- Password: `cashier123`

## 📁 Project Structure
```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User model
│   ├── Product.js         # Product model
│   ├── Sale.js            # Sale model
│   └── Customer.js        # Customer model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product routes
│   ├── sales.js           # Sales routes
│   └── customers.js       # Customer routes
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── .env.example           # Environment variables template
├── server.js              # Entry point
├── seed.js                # Database seeder
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register user (admin only)
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users (admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/barcode/:barcode` - Get product by barcode
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `PUT /api/products/:id/stock` - Update stock (admin only)

### Sales
- `POST /api/sales` - Create new sale
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get single sale
- `GET /api/sales/reports/daily` - Get daily report
- `GET /api/sales/reports/summary` - Get sales summary

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `GET /api/customers/phone/:phone` - Get customer by phone
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

## 🔒 Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Admin-only routes require the user to have `role: "admin"`.

## 🎨 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🧪 Testing with Postman

1. Import the API endpoints into Postman
2. Login to get a token
3. Use the token in Authorization header for protected routes

Example login request:
```json
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "admin@grocery.com",
  "password": "admin123"
}
```

## 🔗 Frontend Repository

[Link to Frontend Repository]

## 📝 License

MIT

## 👨‍💻 Author

Your Name
