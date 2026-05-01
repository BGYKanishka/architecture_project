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

INSERT INTO genres (name)
VALUES
    ('Fiction'),
    ('Non-Fiction'),
    ('Academic & Education'),
    ('Children''s Books'),
    ('Art & Photography'),
    ('Romance'),
    ('Sci-Fi & Fantasy'),
    ('Biography')
ON CONFLICT (name) DO NOTHING;