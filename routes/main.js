const express = require('express');
const router = express.Router();
const db = global.db;

// Home page
router.get('/', (req, res) => {
    res.render('home');
});

module.exports = router;