use carsdb;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);
ALTER TABLE users ADD COLUMN email VARCHAR(255);
INSERT INTO users (username, password) VALUES ('admin', 'admin123');
INSERT INTO users (username, password) VALUES ('1', '1');
update users set email = 'test@gmail.com' where username='1';
select * from users;
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;



CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
select * from cars ;
delete from cars where car_id=14;
DESCRIBE cars;
ALTER TABLE cars ADD COLUMN stock INT DEFAULT 0;
UPDATE cars SET stock = 11 WHERE car_id = 8;
delete from cars where car_id=9;

ALTER TABLE cars AUTO_INCREMENT = 9;


CREATE TABLE IF NOT EXISTS user_cars (
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  PRIMARY KEY (user_id, car_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE
);

INSERT INTO user_cars (user_id, car_id)
SELECT 1, car_id FROM cars;

-- Assign all cars currently owned by user 1 also to user 2
INSERT INTO user_cars (user_id, car_id)
SELECT 2, car_id FROM user_cars WHERE user_id = 1;

insert into user_cars(user_id,car_id) values (2,1),(2,2),(2,3),(2,4),(2,5),(2,6);

select * from user_cars;


ALTER TABLE cars DROP FOREIGN KEY fk_user;
ALTER TABLE cars DROP COLUMN user_id;

SELECT username, email, created_at FROM users WHERE id = 2;


-- Users table
INSERT INTO users (id, username, password, email, created_at) VALUES
(1, 'admin', 'admin123', 'admin@gmail.com', '2025-05-19 21:49:14');
INSERT INTO users (id, username, password, email, created_at) VALUES
(2, '1', '1', 'test@gmail.com', '2025-05-19 21:49:14');

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





