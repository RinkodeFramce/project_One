-- Create database
CREATE DATABASE datakrat_db;

-- Connect to database
\c datakrat_db;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    inn VARCHAR(12) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test clients
INSERT INTO clients (inn, name) VALUES
    ('1234567890', 'ООО "Первая компания"'),
    ('0987654321', 'ИП Иванов А.А.'),
    ('1111111111', 'ООО "Тестовая фирма"')
ON CONFLICT (inn) DO NOTHING; 