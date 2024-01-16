const pool = require('../db');
const stationQueries = require('../queries/stationQueries');
const { v4: uuidv4 } = require('uuid');


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

    static async createStation(stationData, parkingPlacesData) {
        const stationId = uuidv4();

        try {
            await pool.query('BEGIN');

            // Insert the new station
            await pool.query(stationQueries.createStation, [
                stationId,
                stationData.name,
                stationData.location,
                stationData.operational,
                parkingPlacesData,
            ]);

            // Insert parking places for the station
            for (const parkingPlaceData of parkingPlacesData) {
                const parkingPlaceId = uuidv4();

                await pool.query(stationQueries.createParkingPlace, [
                    parkingPlaceId,
                    stationId,
                    parkingPlaceData.bike_categories,
                    parkingPlaceData.occupied,
                ]);

                // Insert bike categories for the parking place
                for (const bikeCategory of parkingPlaceData.bike_categories) {
                    const bikeCategoryId = uuidv4();

                    await pool.query(stationQueries.createBikeCategory, [
                        bikeCategoryId,
                        bikeCategory.name,
                    ]);

                    // Associate bike category with parking place
                    await pool.query(stationQueries.createParkingPlaceBikeCategory, [
                        parkingPlaceId,
                        bikeCategoryId,
                    ]);
                }
            }

            await pool.query('COMMIT');

            return stationId;
        } catch (error) {
            await pool.query('ROLLBACK');
            throw error;
        }
    }

    static async deleteStationById(stationId) {
        try {
            await pool.query('BEGIN');

            // Delete the station
            await pool.query(stationQueries.deleteStationById, [stationId]);

            await pool.query('COMMIT');
        } catch (error) {
            await pool.query('ROLLBACK');
            throw error;
        }
    }

    static async getAllBikeCategories() {
        try {
            const { rows } = await pool.query(stationQueries.getAllBikeCategories);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async createBikeCategory(bikeCategoryData) {
        try {
            // Check if the bike category already exists
            const existingCategory = await pool.query(stationQueries.getBikeCategoryByName, [bikeCategoryData.name]);

            if (existingCategory.rows.length > 0) {
                // If it exists, return the existing category
                return existingCategory.rows[0];
            } else {
                // If it doesn't exist, create a new bike category
                const newCategory = await pool.query(stationQueries.createBikeCategory, [
                    uuidv4(),
                    bikeCategoryData.name,
                ]);

                return newCategory.rows[0];
            }
        } catch (error) {
            throw error;
        }
    }

    static async getBikeCategoryByName(categoryName) {
        try {
            const { rows } = await pool.query(stationQueries.getBikeCategoryByName, [categoryName]);

            if (rows.length === 0) {
                return null; // Bike category not found
            }

            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getBikeCategoryById(categoryId) {
        try {
            const result = await pool.query(stationQueries.getBikeCategoryById, [categoryId]);

            if (result.rows.length === 0) {
                return null; // Bike category not found
            }

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async deleteBikeCategoryById(categoryId) {
        try {
            await pool.query(stationQueries.deleteBikeCategoryById, [categoryId]);
        } catch (error) {
            throw error;
        }
    }

}

module.exports = StationModel;
