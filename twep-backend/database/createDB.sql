CREATE DATABASE twep;
 
\c twep;
 
 -- \dt to display all tables in psql

 -- Enable uuid-ossp extension (if not enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

 CREATE TABLE stations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255),
    location JSONB,
    parking_places JSONB[],
    operational BOOLEAN
);

CREATE TABLE parking_places (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    bike_categories JSONB[],
    occupied BOOLEAN
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

