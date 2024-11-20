const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // Route to retrieve orders based on userID
  router.get('/exportCartData', (req, res) => {
    const userID = req.query.userID; // Retrieve userID from query parameters
    if (!userID) {
      console.error("UserID is missing in the request");
      return res.status(400).send('UserID is required');
    }

    console.log("Fetching orders for userID:", userID); // Log the userID for debugging

    const query = `
      SELECT Orders.OrderID, Orders.UserID, Orders.Order_Date, Orders.Order_Delivery_Date, Orders.Order_Cost,
             Order_Info.ProductID, Order_Info.Order_Qty, Order_Info.Product_Name
      FROM Orders
      JOIN Order_Info ON Orders.OrderID = Order_Info.OrderID
      WHERE Orders.UserID = ? 
    `;

    db.all(query, [userID], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err.message); // Log specific SQL error
        return res.status(500).send('Unable to retrieve order data');
      }

      if (!rows || rows.length === 0) {
        console.log("No orders found for userID:", userID); // Log if no orders found
        return res.status(404).send('No orders found for the user');
      }

      // Process and format the response
      const orders = rows.reduce((acc, row) => {
        const {
          OrderID,
          UserID,
          Order_Date,
          Order_Delivery_Date,
          Order_Cost,
          ProductID,
          Order_Qty,
          Product_Name
        } = row;

        if (!acc[OrderID]) {
          acc[OrderID] = {
            OrderID,
            UserID,
            Order_Date,
            Order_Delivery_Date,
            Order_Cost,
            items: []
          };
        }

        acc[OrderID].items.push({
          ProductID,
          Product_Name,
          Order_Qty
        });

        return acc;
      }, {});

      console.log("Formatted orders response:", Object.values(orders)); // Log the final response structure
      res.json(Object.values(orders));
    });
  });

  // Route to insert a new order
  router.post('/exportCartData', (req, res) => {
    const { userID, items } = req.body;

    if (!userID) {
      console.error("UserID is missing in the request");
      return res.status(400).json({ message: 'UserID is required' });
    }

    if (!items || items.length === 0) {
      console.error("Items are missing in the request");
      return res.status(400).json({ message: 'Items are required' });
    }

    console.log("Creating order for userID:", userID); // Log userID for debugging

    // Calculate total order cost
    let orderCost = 0;
    items.forEach((item) => {
      orderCost += item.Product_Cost * item.quantity;
    });

    const orderDate = new Date().toISOString().split('T')[0];  // Today's date in `YYYY-MM-DD` format
    const deliveryDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];  // Tomorrow's date

    db.get("SELECT MAX(OrderID) AS maxOrderID FROM Orders", (err, row) => {
      if (err) {
        console.error("Error retrieving max OrderID:", err.message);
        return res.status(500).json({ message: 'Error retrieving max OrderID' });
      }

      const newOrderId = (row.maxOrderID === null) ? 1 : row.maxOrderID + 1;

      const insertOrderQuery = `
        INSERT INTO Orders (OrderID, UserID, Order_Date, Order_Delivery_Date, Order_Cost)
        VALUES (?, ?, ?, ?, ?)
      `;

      const insertOrderInfoQuery = `
        INSERT INTO Order_Info (OrderID, ProductID, Order_Qty, Product_Name)
        VALUES (?, ?, ?, ?)
      `;

      const decrementProductQtyQuery = `
        UPDATE Product
        SET Product_Qty = Product_Qty - ?
        WHERE Product_ID = ?
      `;

      db.run(insertOrderQuery, [newOrderId, userID, orderDate, deliveryDate, orderCost], function (err) {
        if (err) {
          console.error("Error inserting into Orders table:", err.message);
          return res.status(500).json({ message: 'Error creating new order' });
        }

        const insertAndUpdatePromises = items.map((item) => {
          return new Promise((resolve, reject) => {
            db.run(insertOrderInfoQuery, [newOrderId, item.Product_ID, item.quantity, item.Product_Name], function (err) {
              if (err) {
                console.error("Error inserting into Order_Info table:", err.message);
                reject(err);
              } else {
                resolve();
              }
              db.run(decrementProductQtyQuery, [item.quantity, item.Product_ID], function (err) {
                if (err) {
                  console.error("Error updating product quantity:", err.message);
                  return reject(err);
                }
                resolve();
              });
            });
          });
        });

        Promise.all(insertAndUpdatePromises)
          .then(() => res.status(200).json({ message: 'Checkout successful', orderId: newOrderId }))
          .catch((error) => {
            console.error("Error inserting order details:", error.message);
            res.status(500).json({ message: 'Error inserting order details' });
          });
      });
    });
  });

  return router;
};
