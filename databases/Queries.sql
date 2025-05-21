create database carsdb;
use carsdb;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
describe users;
select * from users;
update users set created_at = CURRENT_TIMESTAMP;
ALTER TABLE users AUTO_INCREMENT = 3;

ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
UPDATE users SET is_admin = TRUE WHERE username = 'admin';



delete from users where id=3;

CREATE TABLE IF NOT EXISTS cars (
  car_id INT AUTO_INCREMENT PRIMARY KEY,
  model VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  year INT,
  mileage INT DEFAULT 0,
  color VARCHAR(50),
  price DECIMAL(10, 2),
  stock INT DEFAULT 0
);

describe cars;
select * from cars ;
ALTER TABLE cars AUTO_INCREMENT = 20;

delete from cars where car_id=14;

CREATE TABLE IF NOT EXISTS user_cars (
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  PRIMARY KEY (user_id, car_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE
);
describe user_cars;

select * from user_cars;
delete from user_cars where user_id = '2' and car_id='9';


CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    salesperson_name VARCHAR(100),
    salesperson_id VARCHAR(50),
    transaction_number VARCHAR(50) UNIQUE,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
);
select * from transactions;
INSERT INTO transactions (user_id, car_id, salesperson_name, salesperson_id, transaction_number)
VALUES 
(2, 1, 'Alicia Stone', 'SP011', 'TXN1009'),
(2, 2, 'David Lin', 'SP012', 'TXN1010'),
(2, 3, 'Mohit Sharma', 'SP017', 'TXN1011'),
(2, 4, 'Nina Lopez', 'SP014', 'TXN1012'),
(2, 5, 'Emily Wang', 'SP013', 'TXN1013'),
(2, 6, 'John Carter', 'SP015', 'TXN1014'),
(2, 7, 'Priya Das', 'SP016', 'TXN1015'),
(2, 8, 'John Doe', 'SP017', 'TXN1016');

INSERT INTO transactions (user_id, car_id, salesperson_name, salesperson_id, transaction_number)
VALUES 
(1, 9, 'Benjamin Steward', 'SP018', 'TXN1017');




-- Users table
INSERT INTO users (id, username, password, email, created_at) VALUES
(1, 'admin', 'admin123', 'admin@gmail.com', '2025-05-19 21:49:14');
INSERT INTO users (id, username, password, email, created_at) VALUES
(2, '1', '1', 'test@gmail.com', '2025-05-19 21:49:14');
INSERT INTO users (username, password, email, created_at, is_admin) VALUES
('john_doe', 'password123', 'john@example.com', '2025-05-19 10:15:00', 0),
('jane_smith', 'securepass', 'jane@example.com', '2025-05-18 14:30:00', 0),
('mike_ross', 'suitup', 'mike@example.com', '2025-05-17 08:45:00', 0),
('lisa_ray', 'pass456', 'lisa@example.com', '2025-05-16 09:00:00', 0),
('tom_hardy', 'venom2025', 'tom@example.com', '2025-05-15 12:20:00', 0),
('nina_wong', 'pass789', 'nina@example.com', '2025-05-14 17:10:00', 0),
('kevin_james', 'kj1234', 'kevin@example.com', '2025-05-13 11:11:00', 0),
('emily_clark', 'ecpass', 'emily@example.com', '2025-05-12 13:00:00', 0),
('raj_kapoor', 'rkpass', 'raj@example.com', '2025-05-11 16:40:00', 0);


-- Cars table
INSERT INTO cars (car_id, model, brand, year, mileage, color, price, stock) VALUES
(1, 'Model S', 'Tesla', 2020, 15000, 'Red', 79999.99, 10),
(2, 'Civic', 'Honda', 2019, 30000, 'Blue', 19999.99, 8),
(3, 'Corolla', 'Toyota', 2018, 25000, 'Black', 17999.99, 12),
(4, 'Mustang', 'Ford', 2021, 5000, 'Yellow', 55999.99, 7),
(5, 'Accord', 'Honda', 2020, 12000, 'White', 24999.99, 10),
(6, 'Camry', 'Toyota', 2019, 18000, 'Grey', 22999.99, 13),
(7, 'Challenger', 'Dodge', 2021, 3000, 'Black', 49999.99, 9),
(8, 'Model 3', 'Tesla', 2022, 1000, 'Blue', 44999.99, 11);
INSERT INTO cars (car_id, model, brand, year, mileage, color, price, stock) VALUES
(10, 'X5', 'BMW', 2021, 8000, 'Black', 60999.99, 6),
(11, 'A4', 'Audi', 2020, 14000, 'Silver', 38999.99, 7),
(12, 'CX-5', 'Mazda', 2019, 22000, 'Red', 26999.99, 9),
(13, 'F-150', 'Ford', 2022, 7000, 'White', 52999.99, 8),
(14, 'Leaf', 'Nissan', 2021, 9000, 'Green', 29999.99, 10),
(15, '3 Series', 'BMW', 2020, 15000, 'Blue', 40999.99, 5),
(16, 'Outback', 'Subaru', 2019, 28000, 'Dark Grey', 27999.99, 12),
(17, 'Sorento', 'Kia', 2020, 17000, 'Brown', 31999.99, 8),
(18, 'Santa Fe', 'Hyundai', 2021, 11000, 'Navy', 33999.99, 6),
(19, 'RX 350', 'Lexus', 2022, 6000, 'White', 48999.99, 7);

-- user_cars table
INSERT INTO user_cars (user_id, car_id) VALUES
(1, 1),
(2, 1),
(1, 2),
(2, 2),
(1, 3),
(2, 3),
(1, 4),
(2, 4),
(1, 5),
(2, 5),
(1, 6),
(2, 6),
(1, 7),
(1, 8);

INSERT INTO user_cars (user_id, car_id) VALUES
(5, 1),   -- john_doe → Tesla Model S
(5, 4),   -- john_doe → Ford Mustang
(6, 2),   -- jane_smith → Honda Civic
(6, 5),   -- jane_smith → Honda Accord
(7, 3),   -- mike_ross → Toyota Corolla
(7, 7),   -- mike_ross → Dodge Challenger
(8, 6),   -- lisa_ray → Toyota Camry
(8, 8),   -- lisa_ray → Tesla Model 3
(9, 10),  -- tom_hardy → BMW X5
(9, 11),  -- tom_hardy → Audi A4
(10, 12), -- nina_wong → Mazda CX-5
(10, 14), -- nina_wong → Nissan Leaf
(11, 13), -- kevin_james → Ford F-150
(11, 16), -- kevin_james → Subaru Outback
(12, 17), -- emily_clark → Kia Sorento
(12, 15), -- emily_clark → BMW 3 Series
(13, 18), -- raj_kapoor → Hyundai Santa Fe
(13, 19); -- raj_kapoor → Lexus RX 350

INSERT INTO transactions (user_id, car_id, salesperson_name, salesperson_id, transaction_number) VALUES
(5, 1, 'Alicia Stone', 'SP001', 'TXN3001'),
(5, 4, 'David Lin', 'SP002', 'TXN3002'),
(6, 2, 'Mohit Sharma', 'SP007', 'TXN3003'),
(6, 5, 'Emily Wang', 'SP003', 'TXN3004'),
(7, 3, 'Nina Lopez', 'SP004', 'TXN3005'),
(7, 7, 'John Carter', 'SP005', 'TXN3006'),
(8, 6, 'Priya Das', 'SP006', 'TXN3007'),
(8, 8, 'Raymond King', 'SP008', 'TXN3008'),
(9, 10, 'Sofia Ali', 'SP009', 'TXN3009'),
(9, 11, 'Alan Cooper', 'SP010', 'TXN3010'),
(10, 12, 'Jessica Lane', 'SP011', 'TXN3011'),
(10, 14, 'George M.', 'SP012', 'TXN3012'),
(11, 13, 'Karan Patel', 'SP013', 'TXN3013'),
(11, 16, 'Lucas Grant', 'SP014', 'TXN3014'),
(12, 17, 'Sandy Blake', 'SP015', 'TXN3015'),
(12, 15, 'Vivian Hill', 'SP016', 'TXN3016'),
(13, 18, 'Liam Nair', 'SP017', 'TXN3017'),
(13, 19, 'Olivia Rose', 'SP018', 'TXN3018');

INSERT INTO user_cars (user_id, car_id) VALUES
(5, 1),   -- john_doe → Tesla Model S
(5, 4),   -- john_doe → Ford Mustang
(6, 2),   -- jane_smith → Honda Civic
(6, 5),   -- jane_smith → Honda Accord
(7, 3),   -- mike_ross → Toyota Corolla
(7, 7),   -- mike_ross → Dodge Challenger
(8, 6),   -- lisa_ray → Toyota Camry
(8, 8),   -- lisa_ray → Tesla Model 3
(9, 10),  -- tom_hardy → BMW X5
(9, 11),  -- tom_hardy → Audi A4
(10, 12), -- nina_wong → Mazda CX-5
(10, 14), -- nina_wong → Nissan Leaf
(11, 13), -- kevin_james → Ford F-150
(11, 16), -- kevin_james → Subaru Outback
(12, 17), -- emily_clark → Kia Sorento
(12, 15), -- emily_clark → BMW 3 Series
(13, 18), -- raj_kapoor → Hyundai Santa Fe
(13, 19); -- raj_kapoor → Lexus RX 350

