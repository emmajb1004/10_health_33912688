# Create database script for Health Website

# Create the database
CREATE DATABASE IF NOT EXISTS health;
USE health;

# Create the application user
CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';

-- EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_description TEXT NOT NULL,
    ticket_type_full INT NOT NULL,
    ticket_type_discount INT NOT NULL,
    ticket_price_full INT NOT NULL,
    ticket_price_discount INT NOT NULL,
    event_date DATE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    publishedAt DATETIME DEFAULT NULL,
    modifiedAt DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    is_published TINYINT(1) DEFAULT 0
);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attendee_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    ticket_amount_full INT NOT NULL,
    ticket_amount_discount INT NOT NULL,
    purchase_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manager_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    settings_description TEXT NOT NULL
);

-- USERS TABLE
# Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100),
    hashedPassword VARCHAR(255),
    PRIMARY KEY (id)
);