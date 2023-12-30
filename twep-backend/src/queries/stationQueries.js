const getStations = 'SELECT * FROM stations';
const getStationById = 'SELECT * FROM stations WHERE id = $1';
const createStation = 'INSERT INTO stations (coordinates, number_of_bike_spaces, operational) VALUES ($1, $2, $3) RETURNING *';
const updateStation = 'UPDATE stations SET coordinates = $1, number_of_bike_spaces = $2, operational = $3 WHERE id = $4 RETURNING *';
const deleteStation = 'DELETE FROM stations WHERE id = $1 RETURNING *';

module.exports = {
    getStations,
    getStationById,
    createStation,
    updateStation,
    deleteStation,
};
