CREATE DATABASE bikestations;
 
\c bikestations;
 
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    coordinates VARCHAR(255) NOT NULL,
    number_of_bike_spaces INTEGER NOT NULL,
    operational BOOLEAN NOT NULL
);
 
 
INSERT INTO stations (coordinates, number_of_bike_spaces, operational) VALUES
    ('37.7749,-122.4194', 15, true),
    ('34.0522,-118.2437', 12, true),
    ('40.7128,-74.0060', 20, false),
    ('41.8781,-87.6298', 18, true),
    ('51.5074,-0.1278', 25, false),
    ('48.8566,2.3522', 14, true),
    ('35.6895,139.6917', 10, false),
    ('52.5200,13.4050', 22, true),
    ('25.7617,-80.1918', 17, true),
    ('33.8688,151.2093', 19, false);