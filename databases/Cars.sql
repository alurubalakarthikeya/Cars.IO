-- Create the database
drop database carsdb;
CREATE DATABASE carsdb;
USE carsdb;

-- Create the tables

-- Table for Cars
CREATE TABLE Cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    year YEAR NOT NULL,
    mileage INT NOT NULL,
    color VARCHAR(30) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    UNIQUE (model) -- Added UNIQUE constraint to allow referencing
);

-- Table for Inventory
CREATE TABLE Inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (model) REFERENCES Cars(model) ON DELETE CASCADE,
    INDEX (model) -- Index on model for faster lookups
);

-- Table for Customer
CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100) NOT NULL,
    UNIQUE (contact_info) -- Ensuring unique contact info
);

-- Table for Salesperson
CREATE TABLE Salesperson (
    sperson_id INT AUTO_INCREMENT PRIMARY KEY,
    sperson_name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100) NOT NULL,
    UNIQUE (contact_info) -- Ensuring unique contact info
);

-- Table for Sales Transaction
CREATE TABLE Sales_Transaction (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    car_id INT NOT NULL,
    customer_id INT NOT NULL,
    sperson_id INT NOT NULL,
    FOREIGN KEY (car_id) REFERENCES Cars(car_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (sperson_id) REFERENCES Salesperson(sperson_id) ON DELETE CASCADE,
    INDEX (date), -- Index on date for faster range queries
    INDEX (car_id), -- Index on car_id for faster join operations
    INDEX (customer_id), -- Index on customer_id for faster join operations
    INDEX (sperson_id) -- Index on sperson_id for faster join operations
);

-- Table for Sales Transaction Log
CREATE TABLE Sales_Transaction_Log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operation VARCHAR(10) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES Sales_Transaction(transaction_id) ON DELETE CASCADE,
    INDEX (transaction_id) -- Index on transaction_id for faster lookups
);

-- Triggers

-- Change the delimiter
DELIMITER $$

-- Trigger to update inventory quantity after a sale
CREATE TRIGGER after_sales_transaction_insert
AFTER INSERT ON Sales_Transaction
FOR EACH ROW
BEGIN
    UPDATE Inventory
    SET quantity = quantity - 1
    WHERE model = (SELECT model FROM Cars WHERE car_id = NEW.car_id);
END$$

-- Trigger to prevent inserting a sales transaction if the inventory quantity is zero
CREATE TRIGGER before_sales_transaction_insert
BEFORE INSERT ON Sales_Transaction
FOR EACH ROW
BEGIN
    IF (SELECT quantity FROM Inventory WHERE model = (SELECT model FROM Cars WHERE car_id = NEW.car_id)) <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient inventory for this car model';
    END IF;
END$$

-- Trigger to log every sales transaction insert
CREATE TRIGGER after_sales_transaction_insert_log
AFTER INSERT ON Sales_Transaction
FOR EACH ROW
BEGIN
    INSERT INTO Sales_Transaction_Log (transaction_id, operation) VALUES (NEW.transaction_id, 'INSERT');
END$$

-- Trigger to log every sales transaction update
CREATE TRIGGER after_sales_transaction_update_log
AFTER UPDATE ON Sales_Transaction
FOR EACH ROW
BEGIN
    INSERT INTO Sales_Transaction_Log (transaction_id, operation) VALUES (NEW.transaction_id, 'UPDATE');
END$$

-- Restore the delimiter
DELIMITER ;

-- Insert dummy data

-- Insert dummy data into Cars
INSERT INTO Cars (model, brand, year, mileage, color, price) VALUES
('Model S', 'Tesla', 2020, 15000, 'Red', 79999.99),
('Civic', 'Honda', 2019, 30000, 'Blue', 19999.99),
('Corolla', 'Toyota', 2018, 25000, 'Black', 17999.99),
('Mustang', 'Ford', 2021, 5000, 'Yellow', 55999.99),
('Accord', 'Honda', 2020, 12000, 'White', 24999.99),
('Camry', 'Toyota', 2019, 18000, 'Grey', 22999.99),
('Challenger', 'Dodge', 2021, 3000, 'Black', 49999.99),
('Model 3', 'Tesla', 2022, 1000, 'Blue', 44999.99);

-- Insert dummy data into Inventory
INSERT INTO Inventory (model, quantity) VALUES
('Model S', 5),
('Civic', 10),
('Corolla', 8),
('Mustang', 4),
('Accord', 7),
('Camry', 6),
('Challenger', 5),
('Model 3', 8);

-- Insert dummy data into Customer
INSERT INTO Customer (customer_name, contact_info) VALUES
('John Doe', 'john.doe@example.com'),
('Jane Smith', 'jane.smith@example.com'),
('Charlie Daniels', 'charlie.daniels@example.com'),
('Evelyn Stone', 'evelyn.stone@example.com'),
('George Baker', 'george.baker@example.com'),
('Isabella Moore', 'isabella.moore@example.com'),
('Kevin White', 'kevin.white@example.com');

-- Insert dummy data into Salesperson
INSERT INTO Salesperson (sperson_name, contact_info) VALUES
('Alice Johnson', 'alice.johnson@example.com'),
('Bob Brown', 'bob.brown@example.com'),
('Charlie Daniels', 'charlie.daniels@example.com'),
('Evelyn Stone', 'evelyn.stone@example.com'),
('George Baker', 'george.baker@example.com'),
('Isabella Moore', 'isabella.moore@example.com'),
('Kevin White', 'kevin.white@example.com');

-- Insert dummy data into Sales Transaction
INSERT INTO Sales_Transaction (date, total_price, car_id, customer_id, sperson_id) VALUES
('2023-06-01', 79999.99, 1, 1, 1),
('2023-06-02', 19999.99, 2, 2, 2),
('2023-06-03', 55999.99, 4, 3, 2),
('2023-06-04', 24999.99, 5, 4, 3),
('2023-06-05', 22999.99, 6, 5, 4),
('2023-06-06', 49999.99, 7, 1, 5),
('2023-06-07', 44999.99, 8, 2, 1); 


-- Verify data
SELECT * FROM Cars;
SELECT * FROM Inventory;
SELECT * FROM Customer;
SELECT * FROM Salesperson;
SELECT * FROM Sales_Transaction;
SELECT * FROM Sales_Transaction_Log;
