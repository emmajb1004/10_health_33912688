// Create a new router
const express = require("express")
const router = express.Router()

//password
const bcrypt = require('bcrypt')
const saltRounds = 10

const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect('./login') // redirect to the login page
        } else { 
            next (); // move to the next middleware function
        } 
    }


//route handlers for registering users
router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post(
  '/registered',
  [
    check('email').isEmail().trim().escape(),
    check('username').isLength({ min: 4, max: 20 }).trim().escape(),
    check('password').isLength({min: 4}),
    check('firstName').notEmpty().trim().escape(),
    check('lastName').notEmpty().trim().escape()
  ],
  function (req, res, next) {
    console.log("Form body:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register');
    }

    // saving data in database
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        console.log("Inside bcrypt callback");
      if (err) return next(err);

      let sqlquery =
        'INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?,?,?,?,?)';
      let newUser = [username, firstName, lastName, email, hashedPassword];

      db.query(sqlquery, newUser, (err, result) => {

        if (err) {
            return next(err)
        };

        let message =
          'Hello ' +
          firstName +
          ' ' +
          lastName +
          ', you are now registered! We will send an email to you at ' +
          email;
        message +=
          ' Your password is: ' + plainPassword + ' and your hashed password is: ' + hashedPassword;

        res.send(message);
      });
    });
  }
)
;

//route handlers for logging in users
router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

//route handlers for logging in users
router.post('/loggedin', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

        // Get hashed password for this user from database
        const sqlquery = "SELECT hashedPassword, firstName, lastName FROM users WHERE username = ?";

        db.query(sqlquery, [username], (err,results) => {
            if (err) {
                next (err);
            }
            if (results.length == 0) {
                return res.send("Login failed: username not found.");
            }

            const hashedPassword = results[0].hashedPassword;
            const firstName = results[0].firstName;
            const lastName = results[0].lastName;

            // Compare the password supplied with the password in the database
            bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
                if (err) {
                    next(err);
                }
                else if (result == true) {
                    //successful login
                    // Save user session here, when login is successful
                    req.session.userId = req.body.username;
                    res.send("Login successful! Welcome " + firstName + " " + lastName);
                }
                else {
                    res.send("Login failed. Incorrect Password")
                }
            })
        })
})

//attendee login information

//route handlers for logging in users
router.get('/attendee/login', function (req, res, next) {
    res.render('login-attendee.ejs')
})

//route handlers for logging in users
router.post('/attendee/loggedin', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

        // Get hashed password for this user from database
        const sqlquery = "SELECT hashedPassword, firstName, lastName FROM attendeeUsers WHERE username = ?";

        db.query(sqlquery, [username], (err,results) => {
            if (err) {
                next (err);
            }
            if (results.length == 0) {
                return res.send("Login failed: username not found.");
            }

            const hashedPassword = results[0].hashedPassword;
            const firstName = results[0].firstName;
            const lastName = results[0].lastName;

            // Compare the password supplied with the password in the database
            bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
                if (err) {
                    next(err);
                }
                else if (result == true) {
                    //successful login
                    // Save user session here, when login is successful
                    req.session.userId = req.body.username;
                    res.send("Login successful! Welcome " + firstName + " " + lastName);
                }
                else {
                    res.send("Login failed. Incorrect Password")
                }
            })
        })
})

//route handlers for registering users
router.get('/attendee/register', function (req, res, next) {
    res.render('register-attendee.ejs')
})

router.post(
  '/attendee/registered',
  [
    check('email').isEmail().trim().escape(),
    check('username').isLength({ min: 4, max: 20 }).trim().escape(),
    check('password').isLength({min: 4}),
    check('firstName').notEmpty().trim().escape(),
    check('lastName').notEmpty().trim().escape()
  ],
  function (req, res, next) {
    console.log("Form body:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register-attendee');
    }

    // saving data in database
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        console.log("Inside bcrypt callback");
      if (err) return next(err);

      let sqlquery =
        'INSERT INTO attendeeUsers (username, firstName, lastName, email, hashedPassword) VALUES (?,?,?,?,?)';
      let newUser = [username, firstName, lastName, email, hashedPassword];

      db.query(sqlquery, newUser, (err, result) => {

        if (err) {
            return next(err)
        };

        let message =
          'Hello ' +
          firstName +
          ' ' +
          lastName +
          ', you are now registered! We will send an email to you at ' +
          email;
        message +=
          ' Your password is: ' + plainPassword + ' and your hashed password is: ' + hashedPassword;

        res.send(message);
      });
    });
  }
)
;

// Export the router object so index.js can access it
module.exports = router