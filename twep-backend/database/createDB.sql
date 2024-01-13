CREATE DATABASE twep;
 
\c twep;
 
 -- \dt to display all tables in psql

 -- Enable uuid-ossp extension (if not enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

 
CREATE TABLE stations (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    location JSONB,
    parking_places JSONB[],
    operational BOOLEAN
);

-- Insert statement with generated UUID and 10 parking places for the station
INSERT INTO stations (id, name, location, parking_places, operational)
VALUES
    (
        uuid_generate_v4(),
        'Bike Station with 10 Parking Places',
        '{"latitude": 46.6272, "longitude": 14.3089}',
        (
            SELECT array_agg(
                ('{"id": "' || uuid_generate_v4() || '", "bikeCategories": [{"id": "' || uuid_generate_v4() || '", "name": "City Bike"}], "occupied": false}')::jsonb
            )
            FROM generate_series(1, 10)
        ),
        true
    );




CREATE TABLE parking_places (
    id UUID PRIMARY KEY,
    station_id UUID REFERENCES stations(id),
    occupied BOOLEAN NOT NULL
);

CREATE TABLE bike_categories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE parking_place_bike_categories (
    parking_place_id UUID REFERENCES parking_places(id),
    bike_category_id UUID REFERENCES bike_categories(id),
    PRIMARY KEY (parking_place_id, bike_category_id)
);



