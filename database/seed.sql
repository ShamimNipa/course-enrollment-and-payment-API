-- 1. INSERT SAMPLE USERS

INSERT INTO users
(name, email, password_hash, role)
VALUES
(
    'Nipa',
    'nipa@example.com',
    'demo_hash_nipa_not_a_real_password_hash',
    'student'
),
(
    'Rahim',
    'rahim@example.com',
    'demo_hash_rahim_not_a_real_password_hash',
    'student'
),
(
    'Admin User',
    'admin@example.com',
    'demo_hash_admin_not_a_real_password_hash',
    'admin'
);


-- 2. INSERT SAMPLE COURSES

INSERT INTO courses
(title, description, price, status)
VALUES
(
    'JavaScript Fundamentals',
    'Learn JavaScript from beginner to intermediate level.',
    1500.00,
    'published'
),
(
    'Node.js Backend Development',
    'Learn backend development using Node.js and Express.',
    2500.00,
    'published'
),
(
    'React Fundamentals',
    'Learn React and build interactive frontend applications.',
    2000.00,
    'published'
);


-- 3. INSERT SAMPLE ENROLLMENTS

INSERT INTO enrollments
(user_id, course_id, status)
VALUES
(
    (SELECT id FROM users WHERE email = 'nipa@example.com'),
    (SELECT id FROM courses WHERE title = 'JavaScript Fundamentals'),
    'active'
),
(
    (SELECT id FROM users WHERE email = 'nipa@example.com'),
    (SELECT id FROM courses WHERE title = 'Node.js Backend Development'),
    'pending'
),
(
    (SELECT id FROM users WHERE email = 'rahim@example.com'),
    (SELECT id FROM courses WHERE title = 'React Fundamentals'),
    'active'
);


-- 4. INSERT SAMPLE PAYMENTS

INSERT INTO payments
(
    enrollment_id,
    amount,
    currency,
    payment_provider,
    transaction_id,
    status,
    paid_at
)
VALUES
(
    (
        SELECT e.id
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        JOIN courses c ON e.course_id = c.id
        WHERE u.email = 'nipa@example.com'
        AND c.title = 'JavaScript Fundamentals'
    ),
    1500.00,
    'BDT',
    'demo',
    'DEMO-TXN-001',
    'success',
    CURRENT_TIMESTAMP
),
(
    (
        SELECT e.id
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        JOIN courses c ON e.course_id = c.id
        WHERE u.email = 'nipa@example.com'
        AND c.title = 'Node.js Backend Development'
    ),
    2500.00,
    'BDT',
    'demo',
    'DEMO-TXN-002',
    'pending',
    NULL
),
(
    (
        SELECT e.id
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        JOIN courses c ON e.course_id = c.id
        WHERE u.email = 'rahim@example.com'
        AND c.title = 'React Fundamentals'
    ),
    2000.00,
    'BDT',
    'demo',
    'DEMO-TXN-003',
    'success',
    CURRENT_TIMESTAMP
);
