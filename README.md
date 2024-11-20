# Changelog

<u>12 Oct 2024</u> - DS

- Added `sqlite3` and `express` in `package.json`, under -> `dependencies`. Previous `package.json` did not contain those dependencies - application did not run as intended.

```
# To save the dependencies after installation
npm install express --save
npm install sqlite3 --save
```

- Installed `concurrently` package -> To run both the application and the server in one command

<u>26 Oct 2024</u> - DS

- Modularised the functions in `server.js` - Easier for us to work on our assigned portions.
  - Example - The code in `/api/login` route, is now in a separated file, instead of `server.js`.
  - Cleaner look for `server.js`

<u>28 Oct 2024</u> - DS

- Separated the `authenticateJWT()` into another module under `auth_jwt.js`. This is allow the reuse of `authenticateJWT()` for other modules.
  - Check [this section](#reusing-authenticatejwt)

<u>29 Oct 2024</u> - Atikah

DB added to the project based on our report submission - changes made to the Login table:

1. userID to auto Increment (AI) when generated
2. mobile >8 changed to =8

Updated /login page to get email and password from Login table.
Updated /register to include registration for both admin and customer.
Customer table will populate with userid and company name accordingly during registration.

    "email": "testcustomer@example.com",
    "password": "password123",
    "role": "customer",

    "email": "testadmin@example.com",
    "password": "password123",
    "role": "admin",

DO note that if you login as customer, you will NOT be able to access /report and /register pages as they are restricted to admin roles.
Feel free to add your own test users.

<u>30 Oct 2024</u> - Atikah

To Note: assigned customer role to add to shopping cart while admin roles can add, update and delete products

Updates:

- created a new component to log the user roles that was previously used in app.jsx routing.
- userContext.jsx where authentication is verified and userRole is logged thru the app
- updated add, update, delete and get for products.js backend and created the frontend to reference db product table.
- added a form to add product in Product page
- update form and delete confirmation implemented and checked.
- populated Product table with samples x10 - to note that all the IDs need to be changed to auto increment if we want to auto assign. - changes already made to product and login table.
- removed supplier json and product json
- removed customerPage because i forgot to remove in the last update after implementing register form :> ok

Issues Fixed:

- user roles not captured when we route to other pages aside from login.
- Fixed by implementing userContext.jsx

# Issues & Fixes

<u>12 Oct 2024</u> - DS

- Login function was not working -> commented out the Link tag, seems to be the issue.

- File path of the DB file was `./prototypeV1.db`, this will work if the `node server.js` command is executed within the same directory. To help with the standardisation, run the `npm run start_dev` in the parent directory - changed the DB file path to `./src/backend/prototypeV1.db`, minimises pathing issues.

```
# Located at components/Login.jsx
<div className="text-sm">
{/* <Link
    to="#"
    className="font-semibold text-indigo-600 hover:text-indigo-500"
>
    Forgot password?
</Link> */}
</div>
```

<u>26 Oct 2024</u> - DS

- No `Access-control-allow-origin` Error - After logging in, the JWT authentication wasn't working.
  - Just had to declare AFTER the CORS intialisation.
  ```
  app.use(cors(corsOptions));  // Apply CORS with specific options
  app.use(express.json()); // Middleware to parse JSON bodies
  app.use('/products',products(db))
  app.use('/auth_jwt',auth_jwt)
  app.use('/login',login(db))
  app.use('/register',register(db))
  app.use('/customer',customer(db))
  app.use('/reports',reports(db))
  app.use('/customer-view',customer_view(db))
  ```
- Haven't figure out a way to check if requests sent are legitimate - authenticated by JWT. Need to work on this.
  - Example - products API can be called without authentication, it returns the SQL query.

# To run the REACT application

After creating the branch to local PC, run the following commands. This is for installation only, not running the server.

```
# To install the packages
npm install

# If encounter some vulnerability prompt message
# npm audit fix
```

To run the server, you need to run both the `server.js` and the REACT application itself - `npm run-dev`. `server.js` is located in `./src/backend/`. Initially, 2 terminals is needed to run these 2 commands - too troublesome.

`Concurrently` is installed to run both commands at the same time.

```
# Instead of npm run dev and node server.js, we can simply run

npm run start_dev
```

# Backend - Express JS Routing

> With reference to Lecture 09 - Page 36 on express.Router

Currently, the `server.js` file only contains routes to the different modules - where modules are the different functionalities of the system, as well as the database intialisation and CORS configuration.

## `Server.js`

```
const products = require('./products')
const auth_jwt = require('./auth_jwt')
const login = require('./login')
const register = require('./register')

app.use('/products',products(db))
app.use('/auth_jwt',auth_jwt)
app.use('/login',login(db))
app.use('/register',register(db))
```

If you look at the `app.use()` function, you will notice a `(db)`. This is to pass the database connection to the module.

> Essentially, you will have to do the following to work on your portion:

1. Declare the module - Create a variable with the same name as the module, and assign the module to it.
2. Declare the usage - `app.use('[the route]', [variable](db))`

<u>Module Example</u>

This module is used for operations involving products, so all the code/functions is done here.

```
const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/all',(req, res) => {
        db.all('SELECT * FROM product', (err, rows) => {
            if (err) {
                console.error(err.message)
                // 500 is web server error - even though its SQl related, just categorise as 500.
                res.status(500).send('Unable to retrieve all products');
            } else {
                // This should be consistent to the frontend - like data is the frontend looking for.
                res.json(rows);
            }
            });
    });

    return router;
  };

```

### <u>Reusing AuthenticateJWT()</u>

This was added because initially, anyone can call the API and have direct access to the database. Logically, this should not happen.

To use the function - No action needed on the module.js.

```
// server.js
// Include the authneticateJWT in your use function for your respective modules.
app.use('/reports',authenticateJWT,reports(db))
====================
```

> If you want to debug, or do development, just remove the authenticateJWT from the .use() function.
