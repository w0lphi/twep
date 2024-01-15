const getStations = `SELECT s.id, s.name, s.location, s.operational, json_agg(json_build_object('id', pp.id, 'bike_categories', pp.bike_categories, 'occupied', pp.occupied)) AS parking_places FROM stations s LEFT JOIN parking_places pp ON s.id = pp.station_id GROUP BY s.id, s.name, s.location, s.operational`;
const getStationById = 'SELECT * FROM stations WHERE id = $1';
const createStation = 'INSERT INTO stations(id, name, location, operational) VALUES($1, $2, $3, $4)';
const createParkingPlace = 'INSERT INTO parking_places(id, station_id, bike_categories, occupied) VALUES($1, $2, $3, $4)';
const createBikeCategory = 'INSERT INTO bike_categories(id, name) VALUES($1, $2)';
const createParkingPlaceBikeCategory = 'INSERT INTO parking_place_bike_categories(parking_place_id, bike_category_id) VALUES($1, $2)';


module.exports = {
    getStations,
    getStationById,
    createStation,
    createParkingPlace,
    createBikeCategory,
    createParkingPlaceBikeCategory,
};
