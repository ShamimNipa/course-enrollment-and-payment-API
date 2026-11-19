-- 1. SELECT: Get all users

SELECT * FROM users;


-- 2. SELECT: Get all courses

SELECT * FROM courses;


-- 3. SELECT: Get all enrollments

SELECT * FROM enrollments;


-- 4. SELECT: Get all payments

SELECT * FROM payments;


-- 5. WHERE: Find a user by email

SELECT *
FROM users
WHERE email = 'nipa@example.com';


-- 6. ORDER BY: Sort courses by price

SELECT *
FROM courses
ORDER BY price ASC;


-- 7. UPDATE: Change course price

UPDATE courses
SET price = 1800.00
WHERE title = 'JavaScript Fundamentals';


-- 8. VERIFY UPDATED PRICE

SELECT *
FROM courses
WHERE title = 'JavaScript Fundamentals';


-- 9. INNER JOIN: Users and their courses

SELECT
    u.name,
    c.title,
    c.price,
    e.status AS enrollment_status

FROM enrollments e

INNER JOIN users u
ON e.user_id = u.id

INNER JOIN courses c
ON e.course_id = c.id;


-- 10. JOIN: Payment information

SELECT
    u.name,
    c.title,
    p.amount,
    p.transaction_id,
    p.status AS payment_status

FROM payments p

INNER JOIN enrollments e
ON p.enrollment_id = e.id

INNER JOIN users u
ON e.user_id = u.id

INNER JOIN courses c
ON e.course_id = c.id;


-- 11. LEFT JOIN: All users and their enrollments

SELECT
    u.name,
    e.id AS enrollment_id,
    e.status

FROM users u

LEFT JOIN enrollments e
ON u.id = e.user_id;


-- 12. DELETE: Create and delete a temporary course

INSERT INTO courses
(title, description, price, status)
VALUES
(
    'Delete Practice',
    'Temporary record',
    100.00,
    'draft'
);

DELETE FROM courses
WHERE title = 'Delete Practice';


-- 13. VERIFY DELETION

SELECT *
FROM courses
WHERE title = 'Delete Practice';
