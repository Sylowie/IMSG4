const express = require('express');
const router = express.Router();

// Get, add, remove, and update products
module.exports = (db) => {
 
  router.get('/all', (req, res) => {
    db.all('SELECT * FROM Product', (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Unable to retrieve all products');
      } else {
        res.json(rows);
      }
    });
  });

  router.post('/add', (req, res) => {
    console.log('Received data:', req.body);
    const { name, description, cost, quantity, category } = req.body;

    const sql = `INSERT INTO Product (Product_Name, Product_Description, Product_Cost, Product_Qty, Product_Category)
                 VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [name, description, cost, quantity, category], function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error adding product');
      } else {
        res.status(201).json({ message: 'Product added successfully', productId: this.lastID });
      }
    });
  });

  router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, cost, quantity, category } = req.body;

    const sql = `UPDATE Product
                 SET Product_Name = ?, Product_Description = ?, Product_Cost = ?, Product_Qty = ?, Product_Category = ?
                 WHERE Product_ID = ?`;

    db.run(sql, [name, description, cost, quantity, category, id], function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error updating product');
      } else {
        res.status(200).json({ message: 'Product updated successfully' });
      }
    });
  });

  router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM Product WHERE Product_ID = ?`;

    db.run(sql, [id], function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error deleting product');
      } else {
        res.status(200).json({ message: 'Product deleted successfully' });
      }
    });
  });

  return router;
};
