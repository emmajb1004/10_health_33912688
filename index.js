/**
* index.js
* This is your main app entry point
*/
//overall design/layout of pages reference: https://www.youtube.com/watch?v=1NrHkjlWVhM
// Set up express, bodyparser and EJS
const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(path.join(__dirname, 'public')));

// Define the database connection (callback style, without .env)
const db = mysql.createPool({
    host: 'localhost',
    user: 'health_app',        // hard-coded username
    password: 'qwertyuiop',    // hard-coded password
    database: 'health',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// Routes
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const attendeeRoutes = require('./routes/attendee')
app.use('/attendee', attendeeRoutes)

const settingsRoutes = require('./routes/settings')
app.use('/settings', settingsRoutes)

const organizerRoutes = require('./routes/organizer')
app.use('/organizer', organizerRoutes)

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})