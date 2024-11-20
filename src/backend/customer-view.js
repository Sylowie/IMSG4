const express = require('express');
const router = express.Router();

// Customer View - Hello Atikah, this is meant to address the homepage for admin/customers.
// Maybe after login, the app checks for user.role - if it is a customer, then redirect here maybe?

module.exports = (db) => {  
    router.get('/',(req, res) => {
        // Code here
    });
  
    return router;
  };
