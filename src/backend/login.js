const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'a573fa6918b99e545b4bc39570a97be36c622b708cad27e13bdbab58d798d2359c9472884610d13814eaa83105286b7081c73593d3b6d97a18529a3124a05191';

module.exports = (db) => {  
    router.post('/', (req, res) => {
        const { email, password } = req.body;
        console.log("Login request received for:", email);

        const query = 'SELECT * FROM Login WHERE email = ?';
        
        // Fetch the user from the database
        db.get(query, [email], async (err, user) => {
            if (err) {
                console.error("Database error:", err.message);
                return res.status(500).json({ error: err.message });
            }
        
            if (!user) {
                console.log("User not found with email:", email);
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            
            // Check if user.password exists before comparing
            if (!user.Password) {
                console.error("Password field is undefined for user:", email);
                return res.status(500).json({ error: "Password field is missing in the database record" });
            }

            console.log("Retrieved user details - Email:", user.Email, "Role:", user.Role, "UserID:", user.UserID);

            // Compare the provided password with the hashed password in the database
            try {
                const isPasswordValid = await bcrypt.compare(password, user.Password); // Match column name to database
                
                if (!isPasswordValid) {
                    console.log("Invalid password for user:", email);
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                // Generate a JWT token for the user
                const token = jwt.sign({ email: user.Email, role: user.Role, id: user.UserID }, SECRET_KEY, { expiresIn: '1h' }); // **Added id to token payload**
                console.log("Login successful for:", email); // Debug log
                
                // Send the token to the client
                res.status(200).json({
                    message: 'Login successful',
                    token, 
                    user: { email: user.Email, role: user.Role, id: user.UserID },
                });
            } catch (bcryptError) {
                console.error("Error during password comparison:", bcryptError.message);
                return res.status(500).json({ error: "Error during password comparison" });
            }
        });
    });

    return router;
};
