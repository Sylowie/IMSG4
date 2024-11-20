const express = require('express');
const router = express.Router();

module.exports = (db) => {
  
  // Get all customers
  router.get('/all', (req, res) => {
    const sql = `
      SELECT 
        Customer.*,
        Login.Fname,
        Login.Lname,
        Login.Email,
        Login.Contact
      FROM Customer
      JOIN Login ON Customer.UserID = Login.UserID
    `;

    db.all(sql, (err, rows) => {
      if (err) {
        console.error("Database error:", err.message);
        res.status(500).send('Unable to retrieve all customers');
      } else {
        res.json(rows);
      }
    });
  });

  // Update a customer
  router.put('/update/:userID', (req, res) => {
    const { userID } = req.params;
    const { Fname, Lname, Email, Contact, Company_Name } = req.body;

    // Update the Login table with user information
    const updateLoginSql = `
      UPDATE Login 
      SET Fname = ?, Lname = ?, Email = ?, Contact = ?
      WHERE UserID = ?
    `;

    db.run(updateLoginSql, [Fname, Lname, Email, Contact, userID], function (err) {
      if (err) {
        console.error("Error updating login information:", err.message);
        res.status(500).send('Error updating login information');
        return;
      }

      // Update the Customer table with customer-specific information
      const updateCustomerSql = `
        UPDATE Customer 
        SET Company_Name = ? 
        WHERE UserID = ?
      `;

      db.run(updateCustomerSql, [Company_Name, userID], function (err) {
        if (err) {
          console.error("Error updating customer information:", err.message);
          res.status(500).send('Error updating customer information');
          return;
        }

        res.status(200).json({ message: 'Customer and login information updated successfully' });
      });
    });
  });

  // Delete a customer
  router.delete('/delete/:userID', (req, res) => {
    const { userID } = req.params;

    const sql = `
      DELETE FROM Customer WHERE UserID = ?
    `;

    db.run(sql, [userID], function (err) {
      if (err) {
        console.error("Error deleting customer:", err.message);
        res.status(500).send('Error deleting customer');
        return;
      }

      const deleteLoginSql = `
        DELETE FROM Login WHERE UserID = ?
      `;

      db.run(deleteLoginSql, [userID], function (err) {
        if (err) {
          console.error("Error deleting login information:", err.message);
          res.status(500).send('Error deleting login information');
          return;
        }

        res.status(200).json({ message: 'Customer and login information deleted successfully' });
      });
    });
  });

  return router;
};
