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

ALTER TABLE bike_models
ADD COLUMN category_id UUID REFERENCES bike_categories(id);

CREATE TABLE individual_bikes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bike_category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    bike_model_id UUID REFERENCES bike_models(id) ON DELETE CASCADE
);

ALTER TABLE individual_bikes ADD COLUMN parking_place_id UUID REFERENCES parking_places(id) ON DELETE CASCADE;


CREATE TABLE tickets (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bike_id UUID REFERENCES individual_bikes(id) ON DELETE CASCADE,
    from_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    until_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    immediate_renting BOOLEAN NOT NULL,
    qr_code_base_64 TEXT
);


insert into users (id, email, password, wallet, role)
values ('3d577f6d-f4a3-4c25-a43c-05e7e06298a4','admin@twep.com', '$2b$10$X23DxyLKrGz/.NOUVVmsZ.d1z3diI2OrHvuEvnvl/wM2ly6Jr28KO', 0, 'admin' );
--password is password


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


INSERT INTO bike_categories (name)
VALUES
    ('Mountain Bikes'),
    ('Road Bikes'),
    ('City Bikes');


INSERT INTO bike_models (name, description, wheel_size, extra_features, category_id)
VALUES
    ('Model X', 'Electric bike with powerful motor', 26.5, ARRAY['LCD display', 'Front suspension'], '27721359-8545-4572-907c-8933b9f22900'),
    ('Model Y', 'Mountain bike for off-road adventures', 29, ARRAY['Hydraulic disc brakes', 'Aluminum frame'], 'f6bfb12c-1e6b-4ed0-a8cf-bf771534e6d0'),
    ('Model Z', 'High-performance road bike', 28, ARRAY['Carbon fiber frame', 'Shimano Ultegra components'], 'ff14359e-3e91-449d-b7bb-c0c7ab451a63'),
    ('Model A', 'Comfortable city bike for urban commuting', 26, ARRAY['Rear rack', 'Fenders'], 'd8ddcfcd-20a9-4a60-88d0-f11d6b7c874c');

INSERT INTO individual_bikes (bike_category, status, bike_model_id, parking_place_id)
VALUES
    ('27721359-8545-4572-907c-8933b9f22900', 'available', '3e95689b-1aaf-4369-8ef5-d5849a4dcda9', 'c2c6b68e-759c-496a-a860-ee27c8874884'),
    ('27721359-8545-4572-907c-8933b9f22900', 'available', '81b33045-c559-4ec0-93ad-c7499152c3c1', '6715d329-8ceb-4ccb-9b05-48b73ecfaa77');



