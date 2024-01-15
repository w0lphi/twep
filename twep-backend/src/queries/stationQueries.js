const getStations = 'SELECT * FROM stations';
const getStationById = 'SELECT * FROM stations WHERE id = $1';

module.exports = {
    getStations,
    getStationById,

};
