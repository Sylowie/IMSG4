const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3002;

const products = require('./products')
const auth_jwt = require('./auth_jwt')
const login = require('./login')
const register = require('./register')
const customer = require('./customer')
const reports = require('./reports')
const customer_view = require('./customer-view')
const orders = require('./orders')


// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',  // Replace with your front-end's origin
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Connect to SQLite database
const db = new sqlite3.Database('./src/backend/prototypeV1.db', (err) => {
  if (err) {
    console.error('[-] Error connecting to the database:', err.message);
  } else {
    console.log('[+] Connected to the SQLite database.');
  }
});

app.use(cors(corsOptions));  // Apply CORS with specific options
app.use(express.json()); // Middleware to parse JSON bodies

app.use('/products',products(db))
app.use('/auth_jwt',auth_jwt)
app.use('/login',login(db))
app.use('/register',register(db))
app.use('/customer',customer(db))
app.use('/reports',reports(db))
app.use('/customer-view',customer_view(db))
app.use('/orders', orders(db))



app.listen(port, () => {
  console.log(`[+] Server running on http://localhost:${port}`);
});
