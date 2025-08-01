const router = require('express').Router();
const passport = require('passport');
const passwordUtils = require('../lib/passwordUtils');
const connection = require('../config/database');
const pool = require("../config/database");
const isAuth = require("./authMiddleware").isAuth;
const isAdmin = require("./authMiddleware").isAdmin;
// const User = connection.models.User;

/**
 * -------------- POST ROUTES ----------------
 */

 // TODO
 router.post('/login', passport.authenticate('local', { failureRedirect: "/login-failure", successRedirect: "login-success"}));

 // TODO
 router.post('/register', async (req, res, next) => {
    const password = passwordUtils.genPassword(req.body.password);

    try {
        await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [req.body.username, password]
        );

        res.redirect("/login");
    } catch(err) {
        console.error("Error creating user: ", err);
        res.status(500).send("Error registering user");
        
    }
 });


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth, (req, res, next) => {
    
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    // if (req.isAuthenticated()) {
    //     res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
    // } else {
    //     res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    // }

    res.send("You made it to the route")
});

router.get('/admin-route', isAdmin, (req, res, next) => {
    
    res.send("You made it to the admin route")
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;