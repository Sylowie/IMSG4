const jwt = require('jsonwebtoken'); // JWT for authentication
const express = require('express');
const router = express.Router();

const SECRET_KEY = 'a573fa6918b99e545b4bc39570a97be36c622b708cad27e13bdbab58d798d2359c9472884610d13814eaa83105286b7081c73593d3b6d97a18529a3124a05191';

  // Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expect token in the form "Bearer <token>"
    if (!token) {
      return res.status(403).json({ message: 'Access forbidden: no token provided' });
    }
    // Verify the token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Access forbidden: invalid token' });
      }
      req.user = decoded; // Attach the decoded token data to the request
      next();
    });
  };
  
  // Verify Token endpoint
  router.get('/verify-token', authenticateJWT, (req, res) => {
    // If the JWT is valid, return success with the user info
    res.status(200).json({
      message: 'Token is valid',
      user: req.user  // Send the decoded user information back
    });
  });

  module.exports = router;
  