-- Create the database
CREATE DATABASE IF NOT EXISTS OnlineBanking;
USE OnlineBanking;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Increased size for password hashing
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert example user (password should be hashed in PHP)
INSERT INTO users (username, password, full_name, email, role) 
VALUES ('admin', 'admin123', 'Admin User', 'admin@example.com', 'admin');

-- Ensure strict mode for better security
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';
