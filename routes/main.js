const express = require('express');
const router = express.Router();
const db = global.db;

// Home page
router.get('/', (req, res) => {
    res.render('home');
});

// about page
router.get('/about', (req, res) => {
    res.render('about.ejs');
});


module.exports = router;