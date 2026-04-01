DROP DATABASE IF EXISTS PerfumeriaArabe2026;
CREATE DATABASE IF NOT EXISTS PerfumeriaArabe2026;
USE PerfumeriaArabe2026;

CREATE TABLE IF NOT EXISTS perfumes (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    description TEXT,
    /* price DECIMAL(10,2), */
    image_url TEXT,
    fragrance_family VARCHAR(100),
    gender VARCHAR(50),
    top_notes TEXT,
    middle_notes TEXT,
    base_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);