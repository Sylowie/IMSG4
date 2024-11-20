const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

module.exports = (db) => {
    router.post('/', async (req, res) => {
        const { email, password, role, firstName, lastName, contact, companyName } = req.body;

        // Map frontend names to database column names
        const fname = firstName;
        const lname = lastName;

        console.log("Received registration request with data:", req.body);

        const checkUserQuery = 'SELECT * FROM Login WHERE email = ?';
        db.get(checkUserQuery, [email], async (err, row) => {
            if (err) {
                console.error("Error checking if user exists:", err.message);
                return res.status(500).json({ error: err.message });
            }

            if (row) {
                return res.status(400).json({ message: 'User already exists!' });
            }

            try {
                console.log("Hashing password...");
                const hashedPassword = await bcrypt.hash(password, 10);
                console.log("Password hashed successfully");

                const insertUserQuery = `
                    INSERT INTO Login (Role, Email, Password, Fname, Lname, Contact)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                console.log("Inserting user into Login table...");

                db.run(insertUserQuery, [role, email, hashedPassword, fname, lname, contact], function (err) {
                    if (err) {
                        console.error("Error inserting user into Login table:", err.message);
                        return res.status(500).json({ error: err.message });
                    }

                    const userId = this.lastID;
                    console.log("User inserted with ID:", userId);

                    if (role === 'customer' && companyName) {
                        const insertCustomerQuery = `
                            INSERT INTO Customer (UserID, Company_Name)
                            VALUES (?, ?)
                        `;
                        console.log("Inserting user into Customer table...");

                        db.run(insertCustomerQuery, [userId, companyName], (err) => {
                            if (err) {
                                console.error("Error inserting user into Customer table:", err.message);
                                return res.status(500).json({ error: err.message });
                            }
                            res.status(201).json({ message: 'Customer registered successfully', userId });
                        });
                    } else {
                        res.status(201).json({ message: 'User registered successfully', userId });
                    }
                });
            } catch (err) {
                console.error("Unexpected error during registration:", err.message);
                res.status(500).json({ error: err.message });
            }
        });
    });

    return router;
};
