const pool = require('../db');
const stationQueries = require('../queries/stationQueries');

class StationModel {
    static async getAllStations() {
        try {
            const { rows } = await pool.query(stationQueries.getStations);
            return rows;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = StationModel;
