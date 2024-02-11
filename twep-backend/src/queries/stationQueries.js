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
const createBikeCategory = 'INSERT INTO bike_categories(id, name) VALUES($1, $2)';
const createParkingPlaceBikeCategory = 'INSERT INTO parking_place_bike_categories(parking_place_id, bike_category_id) VALUES($1, $2)';
const deleteStationById = 'DELETE FROM stations WHERE id = $1';

const getAllBikeCategories = 'SELECT * FROM bike_categories';
const getBikeCategoryByName = 'SELECT * FROM bike_categories WHERE name = $1';
const deleteBikeCategoryById = 'DELETE FROM bike_categories WHERE id = $1';
const getBikeCategoryById = 'SELECT * FROM bike_categories WHERE id = $1';

const getAllBikeModels = 'SELECT * FROM bike_models';
const createBikeModel = 'INSERT INTO bike_models (id, name, description, wheel_size, extra_features, category_id) VALUES ($1, $2, $3, $4, $5, $6)';
const updateBikeModel = 'UPDATE bike_models SET name = $1, description = $2, wheel_size = $3, extra_features = $4 WHERE name = $5';
const deleteBikeModel = 'DELETE FROM bike_models WHERE id = $1';

const getAllIndividualBikes = 'SELECT * FROM individual_bikes';
const createIndividualBike = 'INSERT INTO individual_bikes(id, bike_category, status, bike_model_id) VALUES ($1, $2, $3, $4)';
const deleteIndividualBikeById = 'DELETE FROM individual_bikes WHERE id = $1';
const findIndividualBikeById = 'SELECT * FROM individual_bikes WHERE id =$1';
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

module.exports = {
    getUsers,
    getStations,
    getStationById,
    createStation,
    createParkingPlace,
    createBikeCategory,
    createParkingPlaceBikeCategory,
    deleteStationById,
    getAllBikeCategories,
    getBikeCategoryByName,
    deleteBikeCategoryById,
    getBikeCategoryById,
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
};
