# architecture_project

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contact_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    business_name VARCHAR(100),
    role VARCHAR(20) NOT NULL 
        CHECK (role IN ('VENDOR', 'EMPLOYEE', 'ADMIN')),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE floors (
    id SERIAL PRIMARY KEY,
    floor_name VARCHAR(10) UNIQUE NOT NULL 
);
CREATE TABLE stall_types (
    id SERIAL PRIMARY KEY,
    size VARCHAR(10) UNIQUE NOT NULL CHECK (size IN ('SMALL', 'MEDIUM', 'LARGE')),
    price NUMERIC(10,2) NOT NULL
);
CREATE TABLE stalls (
    id SERIAL PRIMARY KEY,
    floor_id INT NOT NULL REFERENCES floors(id) ON DELETE RESTRICT,
    stall_code VARCHAR(10) NOT NULL,
    stall_type_id INT NOT NULL REFERENCES stall_types(id) ON DELETE RESTRICT,
    UNIQUE (floor_id, stall_code)
);
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE user_genres (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    genre_id INT NOT NULL REFERENCES genres(id) ON DELETE RESTRICT,
    PRIMARY KEY (user_id, genre_id)
);
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reservation_date TIMESTAMP DEFAULT NOW(),
    qr_code_token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED'))
);

CREATE TABLE reservation_stalls (
    reservation_id INT NOT NULL REFERENCES reservations(id) ON DELETE RESTRICT,
    stall_id INT NOT NULL REFERENCES stalls(id) ON DELETE RESTRICT,
    PRIMARY KEY (reservation_id, stall_id)
);
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    reservation_id INT NOT NULL REFERENCES reservations(id) ON DELETE RESTRICT,
    amount NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')),
    payment_method VARCHAR(50),
    payment_date TIMESTAMP DEFAULT NOW()
);
CREATE TABLE admin_actions (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action VARCHAR(255) NOT NULL,
    target_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    target_stall_id INT REFERENCES stalls(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

# add stall data
TRUNCATE TABLE stalls, stall_types, floors RESTART IDENTITY CASCADE;

INSERT INTO floors (floor_name) VALUES 
('A'), 
('B'), 
('C'), 
('D'), 
('E'), 
('F'), 
('G'), 
('MainBuilding');

INSERT INTO stall_types (size, price) VALUES 
('SMALL', 5000.00),
('MEDIUM', 7500.00),
('LARGE', 10000.00);

INSERT INTO stalls (floor_id, stall_code, stall_type_id) VALUES 
((SELECT id FROM floors WHERE floor_name='A'), 'A-01', (SELECT id FROM stall_types WHERE size='SMALL')),
((SELECT id FROM floors WHERE floor_name='A'), 'A-02', (SELECT id FROM stall_types WHERE size='SMALL')),
((SELECT id FROM floors WHERE floor_name='A'), 'A-03', (SELECT id FROM stall_types WHERE size='SMALL')),
((SELECT id FROM floors WHERE floor_name='A'), 'A-04', (SELECT id FROM stall_types WHERE size='SMALL'));

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='A'), 
       'A-' || LPAD(seq::text, 2, '0'), 
       (SELECT id FROM stall_types WHERE size='MEDIUM')
FROM generate_series(5, 20) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='B'), 
       'B-' || LPAD(seq::text, 2, '0'), 
       (SELECT id FROM stall_types WHERE size='MEDIUM')
FROM generate_series(1, 8) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) VALUES 
((SELECT id FROM floors WHERE floor_name='C'), 'C-01', (SELECT id FROM stall_types WHERE size='LARGE'));

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='C'), 'C-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='SMALL')
FROM generate_series(2, 6) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='C'), 'C-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='MEDIUM')
FROM generate_series(7, 12) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) VALUES 
((SELECT id FROM floors WHERE floor_name='D'), 'D-01', (SELECT id FROM stall_types WHERE size='LARGE'));

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='D'), 'D-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='SMALL')
FROM generate_series(2, 6) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='D'), 'D-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='MEDIUM')
FROM generate_series(7, 12) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='E'), 
       'E-' || LPAD(seq::text, 2, '0'), 
       (SELECT id FROM stall_types WHERE size='LARGE')
FROM generate_series(1, 5) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='F'), 'F-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='SMALL')
FROM generate_series(1, 4) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='F'), 'F-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='LARGE')
FROM generate_series(5, 6) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='F'), 'F-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='MEDIUM')
FROM generate_series(7, 15) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='G'), 'G-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='SMALL')
FROM generate_series(1, 4) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='G'), 'G-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='LARGE')
FROM generate_series(5, 6) AS seq;

INSERT INTO stalls (floor_id, stall_code, stall_type_id) 
SELECT (SELECT id FROM floors WHERE floor_name='G'), 'G-' || LPAD(seq::text, 2, '0'), (SELECT id FROM stall_types WHERE size='MEDIUM')
FROM generate_series(7, 15) AS seq;
