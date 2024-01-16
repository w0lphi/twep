const getStations = 'SELECT * FROM stations';
const getStationById = 'SELECT * FROM stations WHERE id = $1';
const createStation = 'INSERT INTO stations(id, name, location, operational, parking_places) VALUES($1, $2, $3, $4, $5)';
const createParkingPlace = 'INSERT INTO parking_places(id, station_id, bike_categories, occupied) VALUES($1, $2, $3, $4)';
const createBikeCategory = 'INSERT INTO bike_categories(id, name) VALUES($1, $2)';
const createParkingPlaceBikeCategory = 'INSERT INTO parking_place_bike_categories(parking_place_id, bike_category_id) VALUES($1, $2)';
const deleteStationById = 'DELETE FROM stations WHERE id = $1';


module.exports = {
    getStations,
    getStationById,
    createStation,
    createParkingPlace,
    createBikeCategory,
    createParkingPlaceBikeCategory,
    deleteStationById,
};
