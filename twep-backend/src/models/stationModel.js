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

    static async getStationById(stationId) {
        try {
            const { rows } = await pool.query(stationQueries.getStationById, [stationId]);

            // If no rows are returned, the station with the specified ID was not found
            if (rows.length === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            throw error;
        }
    }

}

module.exports = StationModel;
