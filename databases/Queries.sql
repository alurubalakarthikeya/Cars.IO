use carsdb;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);
INSERT INTO users (username, password) VALUES ('admin', 'admin123');
INSERT INTO users (username, password) VALUES ('1', '1');
select * from users;


CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
select * from cars ;
DESCRIBE cars;


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







