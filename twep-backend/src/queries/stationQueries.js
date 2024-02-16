const getUsers = 'SELECT * FROM users WHERE role = \'user\'';

const getStations = `
    SELECT
    s.id AS id,
    s.name AS name,
    s.location AS location,
    s.operational AS operational,
    json_agg(jsonb_build_object(
        'id', pp.id,
        'bikeCategories', pp.bike_categories,
        'occupied', pp.occupied
    )) AS parking_places
    FROM
    stations s
    LEFT JOIN
    parking_places pp ON s.id = pp.station_id
    GROUP BY
    s.id, s.name, s.location, s.operational;
`;

const getStationById = `
    SELECT
        s.id AS id,
        s.name AS name,
        s.location AS location,
        s.operational AS operational,
        json_agg(jsonb_build_object(
            'id', pp.id,
            'bikeCategories', pp.bike_categories,
            'occupied', pp.occupied
        )) AS parking_places
    FROM
        stations s
    LEFT JOIN
        parking_places pp ON s.id = pp.station_id
    WHERE
        s.id = $1
    GROUP BY
        s.id, s.name, s.location, s.operational;
`;

const createStation = 'INSERT INTO stations(id, name, location, operational) VALUES($1, $2, $3, $4) RETURNING id';
const createParkingPlace = 'INSERT INTO parking_places(id, station_id, occupied, bike_categories) VALUES($1, $2, $3, $4)';
const createBikeCategory = 'INSERT INTO bike_categories(id, name, hour_price) VALUES($1, $2, $3)';
const updateBikeCategoryHourPrice = 'UPDATE bike_categories SET hour_price = $2 WHERE id = $1 RETURNING *'
const createParkingPlaceBikeCategory = 'INSERT INTO parking_place_bike_categories(parking_place_id, bike_category_id) VALUES($1, $2)';

const updateStation = `
        UPDATE 
            stations
        SET 
            name = $2,
            location = $3,
            operational = $4
        WHERE
            id = $1
`;
const updateParkingPlace = `UPDATE parking_places SET occupied = $2, bike_categories = $3 WHERE id = $1`;
const deleteStationById = 'DELETE FROM stations WHERE id = $1';

const getAllBikeCategories = 'SELECT * FROM bike_categories';
const getBikeCategoryByName = 'SELECT * FROM bike_categories WHERE name = $1';
const deleteBikeCategoryById = 'DELETE FROM bike_categories WHERE id = $1';
const getBikeCategoryById = 'SELECT * FROM bike_categories WHERE id = $1';

const getAllBikeModels = 'SELECT * FROM bike_models';
const createBikeModel = `
    INSERT INTO bike_models (id, name, description, wheel_size, extra_features, category_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
`;
const updateBikeModel = 'UPDATE bike_models SET name = $2, description = $3, wheel_size = $4, extra_features = $5, category_id = $6 WHERE id = $1 RETURNING *';
const deleteBikeModel = 'DELETE FROM bike_models WHERE id = $1';

const getAllIndividualBikes = `
    SELECT
    ib.id AS id,
    ib.status AS status,
    bc.id AS category_id,
    bc.name AS category,
    bm.id AS model_id,
    bm.name AS model,
    bm.description AS description,
    bm.wheel_size AS wheel_size,
    bm.extra_features AS extra_features,
    pp.id AS parking_place_id,
    jsonb_build_object(
        'id', s.id,
        'name', s.name,
        'location', s.location,
        'operational', s.operational
    ) AS station
    FROM
    individual_bikes ib
    JOIN
    bike_models bm ON ib.bike_model_id = bm.id
    JOIN
    bike_categories bc ON bm.category_id = bc.id
    LEFT JOIN
    parking_places pp ON ib.parking_place_id = pp.id
    LEFT JOIN
    stations s ON pp.station_id = s.id
    GROUP BY
    ib.id, ib.status, bc.name, bc.id, bm.id, bm.name, bm.description, bm.wheel_size, bm.extra_features, pp.id, s.id
`;

const createIndividualBike = 'INSERT INTO individual_bikes(id, bike_category_id, status, bike_model_id) VALUES ($1, $2, $3, $4) RETURNING *';
const deleteIndividualBikeById = 'DELETE FROM individual_bikes WHERE id = $1';
const findIndividualBikeById = `
    SELECT
        ib.id AS id,
        ib.status AS status,
        bc.id AS category_id,
        bc.name AS category,
        bm.id AS model_id,
        bm.name AS model,
        bm.description AS description,
        bm.wheel_size AS wheel_size,
        bm.extra_features AS extra_features,
        pp.id AS parking_place_id,
        jsonb_build_object(
            'id', s.id,
            'name', s.name,
            'location', s.location,
            'operational', s.operational
        ) AS station
    FROM
        individual_bikes ib
    JOIN
        bike_models bm ON ib.bike_model_id = bm.id
    JOIN
        bike_categories bc ON bm.category_id = bc.id
    LEFT JOIN
        parking_places pp ON ib.parking_place_id = pp.id
    LEFT JOIN
        stations s ON pp.station_id = s.id
    WHERE 
        ib.id = $1
    GROUP BY
        ib.id, ib.status, bc.name, bc.id, bm.id, bm.name, bm.description, bm.wheel_size, bm.extra_features, pp.id, s.id
`;
const updateIndividualBikeParkingPlace = 'UPDATE individual_bikes SET parking_place_id = $1 WHERE id = $2;'
const findAvailableParkingPlace = `
    SELECT id
    FROM parking_places
    WHERE station_id = $1
    AND occupied = false
    AND bike_categories @> ARRAY[$2]::jsonb[];
`;

const markParkingPlaceAsVacant = `
    UPDATE parking_places
    SET occupied = false
    WHERE id = $1;
`;

const markParkingPlaceAsOccupied = `
    UPDATE parking_places
    SET occupied = true
    WHERE id = $1;
`;

const getBikesByModelId = `SELECT * FROM individual_bikes WHERE bike_model_id = $1`

const getAllOpenTicketsForBike = `SELECT * FROM tickets WHERE bike_id = $1 AND until_date >= $2`

const markBikeAsRented = `UPDATE individual_bikes SET status = 'rented' WHERE id = $1;`
const markBikeAsAvailable = `UPDATE individual_bikes SET status = 'available' WHERE id = $1;`

const getAllOverdueTickets = `
    SELECT 
        t.id AS ticket_id,
        t.from_date,
        t.until_date,
        jsonb_build_object(
            'id', u.id,
            'email', u.email
        ) AS user,
        jsonb_build_object(
            'id', b.id,
            'model', bm.name
        ) AS bike
    FROM
        tickets t
    INNER JOIN
        users u ON t.user_id = u.id 
    INNER JOIN
        individual_bikes b ON t.bike_id = b.id
    INNER JOIN
        bike_models bm ON b.bike_model_id = bm.id
    WHERE 
        t.status = 'rented'
    AND
        t.until_date < now();
`

module.exports = {
    getUsers,
    getStations,
    getStationById,
    createStation,
    createParkingPlace,
    createBikeCategory,
    createParkingPlaceBikeCategory,
    deleteStationById,
    updateStation,
    updateParkingPlace,
    getAllBikeCategories,
    getBikeCategoryByName,
    deleteBikeCategoryById,
    getBikeCategoryById,
    updateBikeCategoryHourPrice,
    getAllBikeModels,
    createBikeModel,
    updateBikeModel,
    deleteBikeModel,
    getAllIndividualBikes,
    createIndividualBike,
    deleteIndividualBikeById,
    findIndividualBikeById,
    findAvailableParkingPlace,
    markParkingPlaceAsVacant,
    updateIndividualBikeParkingPlace,
    markParkingPlaceAsOccupied,
    getBikesByModelId,
    getAllOpenTicketsForBike,
    markBikeAsRented,
    markBikeAsAvailable,
    getAllOverdueTickets
};
