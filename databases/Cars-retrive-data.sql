-- 1. Retrieve All Cars and Their Inventory Quantities

SELECT c.car_id, c.model, c.brand, c.year, c.mileage, c.color, c.price, i.quantity
FROM Cars c
JOIN Inventory i ON c.model = i.model;

-- 2. Retrieve All Sales Transactions Along with Customer and Salesperson Information

SELECT st.transaction_id, st.date, st.total_price, c.model, cu.customer_name, cu.contact_info AS customer_contact, sp.sperson_name, sp.contact_info AS salesperson_contact
FROM Sales_Transaction st
JOIN Cars c ON st.car_id = c.car_id
JOIN Customer cu ON st.customer_id = cu.customer_id
JOIN Salesperson sp ON st.sperson_id = sp.sperson_id;

-- 3. Retrieve All Sales Transactions for a Specific Customer
SELECT st.transaction_id, st.date, st.total_price, c.model, sp.sperson_name
FROM Sales_Transaction st
JOIN Cars c ON st.car_id = c.car_id
JOIN Salesperson sp ON st.sperson_id = sp.sperson_id
WHERE st.customer_id = (SELECT customer_id FROM Customer WHERE customer_name = 'John Doe');

-- 4.Retrieve All Sales Transactions Handled by a Specific Salesperson

SELECT st.transaction_id, st.date, st.total_price, c.model, cu.customer_name
FROM Sales_Transaction st
JOIN Cars c ON st.car_id = c.car_id
JOIN Customer cu ON st.customer_id = cu.customer_id
WHERE st.sperson_id = (SELECT sperson_id FROM Salesperson WHERE sperson_name = 'Alice Johnson');

-- 5. Retrieve All Cars Sold on a Specific Date

SELECT st.transaction_id, st.total_price, c.model, cu.customer_name, sp.sperson_name
FROM Sales_Transaction st
JOIN Cars c ON st.car_id = c.car_id
JOIN Customer cu ON st.customer_id = cu.customer_id
JOIN Salesperson sp ON st.sperson_id = sp.sperson_id
WHERE st.date = '2023-06-01';

-- 6. Retrieve Total Sales Amount for Each Salesperson

SELECT sp.sperson_name, SUM(st.total_price) AS total_sales
FROM Sales_Transaction st
JOIN Salesperson sp ON st.sperson_id = sp.sperson_id
GROUP BY sp.sperson_name;

-- 7. Retrieve Cars with Low Inventory (Less than 5 Units)

SELECT c.model, c.brand, i.quantity
FROM Cars c
JOIN Inventory i ON c.model = i.model
WHERE i.quantity < 5;

-- 8. Retrieve Sales Transactions Log

SELECT log_id, transaction_id, log_date, operation
FROM Sales_Transaction_Log
ORDER BY log_date DESC;

-- 9. Retrieve the Most Recent Sales Transaction for Each Car Model

SELECT st.transaction_id, st.date, st.total_price, c.model, cu.customer_name, sp.sperson_name
FROM Sales_Transaction st
JOIN Cars c ON st.car_id = c.car_id
JOIN Customer cu ON st.customer_id = cu.customer_id
JOIN Salesperson sp ON st.sperson_id = sp.sperson_id
WHERE st.date = (SELECT MAX(date) FROM Sales_Transaction WHERE car_id = c.car_id)
ORDER BY st.date DESC;

-- 10. Retrieve Customers Who Have Made Multiple Purchases

SELECT cu.customer_id, cu.customer_name, COUNT(st.transaction_id) AS purchase_count
FROM Customer cu
JOIN Sales_Transaction st ON cu.customer_id = st.customer_id
GROUP BY cu.customer_id, cu.customer_name
HAVING COUNT(st.transaction_id) > 1;

-- 11. Retrieve the Sales History of a Specific Car Model

SELECT st.transaction_id, st.date, st.total_price, cu.customer_name, sp.sperson_name
FROM Sales_Transaction st
JOIN Cars c ON st.car_id = c.car_id
JOIN Customer cu ON st.customer_id = cu.customer_id
JOIN Salesperson sp ON st.sperson_id = sp.sperson_id
WHERE c.model = 'Model S';

