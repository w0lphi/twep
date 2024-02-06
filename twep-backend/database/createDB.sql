CREATE DATABASE twep;
 
\c twep;
 
 -- \dt to display all tables in psql

 -- Enable uuid-ossp extension (if not enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    wallet NUMERIC DEFAULT 0,
    role VARCHAR(50) DEFAULT 'user' NOT NULL
);

CREATE TABLE stations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255),
    location JSONB,
    operational BOOLEAN
);

CREATE TABLE parking_places (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    occupied BOOLEAN,
    bike_categories JSONB[]
);

CREATE TABLE bike_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE parking_place_bike_categories (
    parking_place_id UUID REFERENCES parking_places(id) ON DELETE CASCADE,
    bike_category_id UUID REFERENCES bike_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (parking_place_id, bike_category_id)
);

CREATE TABLE bike_models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    wheel_size FLOAT,
    extra_features TEXT[]
);

CREATE TABLE individual_bikes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bike_category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    bike_model_id UUID REFERENCES bike_models(id) ON DELETE CASCADE
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bike_type VARCHAR(255) NOT NULL,
    station VARCHAR(255) NOT NULL,
    purchase_date TIMESTAMPTZ NOT NULL,
    immediate_renting BOOLEAN NOT NULL,
    reserved_station VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- IDK how to insert admin account with the correct hasing algo directly into the db
-- so I make a normal account using the POST request and then change the role in the db with:

--UPDATE users
--SET role = 'admin'
--WHERE id = ' ';


-- Insert a new station
INSERT INTO stations (name, location, operational) 
VALUES ('Bike Station City Arkaden 2', '{"latitude": 46.62669319613631, "longitude": 14.308627007404851}', true)
RETURNING id;

INSERT INTO parking_places (station_id, occupied, bike_categories)
VALUES
  ('cd323b6a-7647-4423-b0ee-5c611b5e794d', false, ARRAY['{"name": "Mountain Bike"}', '{"name": "Road Bike"}']::jsonb[]),
  ('cd323b6a-7647-4423-b0ee-5c611b5e794d', true, ARRAY['{"name": "City Bike"}', '{"name": "Electric Bike"}']::jsonb[]),
  ('cd323b6a-7647-4423-b0ee-5c611b5e794d', false, ARRAY['{"name": "Hybrid Bike"}', '{"name": "Tandem Bike"}']::jsonb[]),
  ('cd323b6a-7647-4423-b0ee-5c611b5e794d', true, ARRAY['{"name": "Folding Bike"}', '{"name": "Cargo Bike"}']::jsonb[]);
