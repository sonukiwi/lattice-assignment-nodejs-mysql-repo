CREATE DATABASE hospital_app_db;

USE hospital_app_db;

CREATE TABLE hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE psychiatrists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hospital_id INT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255),
    photo VARCHAR(255),
    psychiatrist_id INT,
    FOREIGN KEY (psychiatrist_id) REFERENCES psychiatrists(id)
);

INSERT INTO hospitals (name) VALUES
('Apollo Hospitals'),
('Jawaharlal Nehru Medical College and Hospital'),
('Indira Gandhi Institute of Medical Sciences (IGIMS)'),
('AIIMS - All India Institute Of Medical Science');

-- Insert 5 psychiatrists for Apollo Hospitals
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Rohan Sharma', 1);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Meera Desai', 1);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Vikram Patel', 1);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Anjali Nair', 1);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Arjun Singh', 1);

-- Insert 5 psychiatrists for Jawaharlal Nehru Medical College and Hospital
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Kavita Rao', 2);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Suresh Gupta', 2);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Neha Kumar', 2);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Rajesh Bansal', 2);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Priya Sinha', 2);

-- Insert 5 psychiatrists for Indira Gandhi Institute of Medical Sciences (IGIMS)
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Abhinav Mishra', 3);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Nidhi Verma', 3);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Karan Joshi', 3);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Swati Kapoor', 3);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Manish Khanna', 3);

-- Insert 5 psychiatrists for AIIMS - All India Institute Of Medical Science
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Sameer Saxena', 4);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Ritu Malhotra', 4);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Pankaj Dubey', 4);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Ananya Iyer', 4);
INSERT INTO psychiatrists (name, hospital_id) VALUES ('Dr. Siddharth Kapoor', 4);
