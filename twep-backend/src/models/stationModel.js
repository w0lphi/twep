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

    static async getStationById(id) {
        try {
            const { rows } = await pool.query(stationQueries.getStationById, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async createStation({ coordinates, bikeSpaces, operational }) {
        try {
            const { rows } = await pool.query(stationQueries.createStation, [coordinates, bikeSpaces, operational]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateStation(id, { coordinates, bikeSpaces, operational }) {
        try {
            const { rows } = await pool.query(stationQueries.updateStation, [coordinates, bikeSpaces, operational, id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async deleteStation(id) {
        try {
            const { rows } = await pool.query(stationQueries.deleteStation, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = StationModel;
