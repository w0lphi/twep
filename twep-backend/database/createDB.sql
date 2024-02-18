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
    name VARCHAR(255),
    hour_price FLOAT DEFAULT 0
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

ALTER TABLE bike_models
ADD COLUMN category_id UUID REFERENCES bike_categories(id);

CREATE TABLE individual_bikes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bike_category_id UUID REFERENCES bike_categories(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    bike_model_id UUID REFERENCES bike_models(id) ON DELETE CASCADE
);

ALTER TABLE individual_bikes ADD COLUMN parking_place_id UUID REFERENCES parking_places(id) ON DELETE CASCADE;

CREATE TABLE tickets (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bike_id UUID REFERENCES individual_bikes(id) ON DELETE CASCADE,
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    from_date TIMESTAMPTZ NOT NULL,
    until_date TIMESTAMPTZ NOT NULL,
    immediate_renting BOOLEAN NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0, 
    status TEXT DEFAULT 'unused',
    qr_code_base64 TEXT NOT NULL,
    eligible_for_cancellation BOOLEAN
);

CREATE TABLE ratings (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bike_model_id UUID REFERENCES bike_models(id) ON DELETE CASCADE,
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    bike_model_rating SMALLINT NOT NULL CHECK (bike_model_rating BETWEEN 1 AND 5),
    station_rating SMALLINT NOT NULL CHECK (bike_model_rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL,
    comment TEXT NOT NULL
);

-- insert default admin account into db. Password is "password"
insert into users (id, email, password, wallet, role)
values ('3d577f6d-f4a3-4c25-a43c-05e7e06298a4','admin@twep.com', '$2b$10$X23DxyLKrGz/.NOUVVmsZ.d1z3diI2OrHvuEvnvl/wM2ly6Jr28KO', 0, 'admin' );

-- Insert a new station
INSERT INTO stations (id, name, location, operational) 
VALUES ('4f5d7722-c70b-44c8-ac4f-5cabd81d80ae', 'Bike Station City Arkaden 2', '{"latitude": 46.62669319613631, "longitude": 14.308627007404851}', true);

INSERT INTO parking_places (id, station_id, occupied, bike_categories)
VALUES
  ('7635787f-3f4d-4a1f-93c7-f7efb42f9cfe', '4f5d7722-c70b-44c8-ac4f-5cabd81d80ae', true, ARRAY['{"name": "Mountain Bike"}', '{"name": "Road Bike"}']::jsonb[]),
  ('91faa446-1bf1-4d84-8a54-2b15e0e8f4ca', '4f5d7722-c70b-44c8-ac4f-5cabd81d80ae', true, ARRAY['{"name": "City Bike"}', '{"name": "Electric Bike"}']::jsonb[]);


INSERT INTO bike_categories (id, name, hour_price)
VALUES
    ('daf594a3-c350-42d5-9b1f-7f679ae0a30b', 'Mountain Bike', 0.75),
    ('daf594a3-c350-42d5-9b1f-7f679ae0a30c', 'Road Bike', 0.8),
    ('daf594a3-c350-42d5-9b1f-7f679ae0a30d', 'Electric Bike', 1.5),
    ('daf594a3-c350-42d5-9b1f-7f679ae0a30e', 'City Bike', 1);


INSERT INTO bike_models (id, name, description, wheel_size, extra_features, category_id) 
VALUES 
    ('186760ff-6379-4703-89c2-0844b85b3433', 'KTM Summit Trailblazer', 'Introducing the Summit Trailblazer, a high-performance mountain bike designed for rugged terrains and thrilling adventures. Its lightweight aluminum frame ensures agility, while the precision-engineered suspension system provides a smooth ride. Equipped with responsive disc brakes and versatile gearing, the Summit Trailblazer conquers trails with unmatched reliability and style.', 27.5, '{"Lighweight Aluminium Frame","Improved suspension system","Responsive disc brake"}', 'daf594a3-c350-42d5-9b1f-7f679ae0a30b'),
    ('20acd6d9-262c-4c2b-b80c-2ca04912295b', 'UrbanCruise 500', 'The UrbanCruise 500 is a sleek and agile city bike designed for urban commuters seeking a perfect blend of style and functionality. With a lightweight aluminum frame, comfortable saddle, and responsive brakes, it offers a smooth and efficient ride through the bustling streets, making commuting a breeze.', 29, '{"Extra comfortable saddle","Responsive breaks"}', 'daf594a3-c350-42d5-9b1f-7f679ae0a30e');

INSERT INTO individual_bikes (id, bike_category_id, status, bike_model_id, parking_place_id)
VALUES
    ('b3182d20-32d8-4ee7-93c5-20477f76af13', 'daf594a3-c350-42d5-9b1f-7f679ae0a30e', 'available', '20acd6d9-262c-4c2b-b80c-2ca04912295b', '91faa446-1bf1-4d84-8a54-2b15e0e8f4ca'),
    ('b3182d20-32d8-4ee7-93c5-20477f76af14', 'daf594a3-c350-42d5-9b1f-7f679ae0a30b', 'available', '186760ff-6379-4703-89c2-0844b85b3433', '7635787f-3f4d-4a1f-93c7-f7efb42f9cfe');




