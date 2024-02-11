const pool = require('../db');
const stationQueries = require('../queries/stationQueries');
const { v4: uuidv4 } = require('uuid');


class StationModel {

    static async getAllUsers() {
        try {
            const { rows } = await pool.query(stationQueries.getUsers);
            return rows;
        } catch (error) {
            throw error;
        }
    }

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
            const result = await pool.query(stationQueries.createStation, [
                stationId,
                stationData.name,
                stationData.location,
                stationData.operational,
            ]);

            const createdStation = result.rows[0];

            // Insert parking places for the station
            for (const parkingPlaceData of parkingPlacesData) {
                const parkingPlaceId = uuidv4();

                // Convert bike categories array to an array of stringified JSON objects
                const bikeCategoriesArray = parkingPlaceData.bikeCategories.map(category => JSON.stringify(category));

                await pool.query(stationQueries.createParkingPlace, [
                    parkingPlaceId,
                    stationId,
                    parkingPlaceData.occupied,
                    bikeCategoriesArray,
                ]);


            }
            const detailedStationInfo = await pool.query(stationQueries.getStationById, [stationId]);
            const detailedStation = detailedStationInfo.rows[0];

            await pool.query('COMMIT');

            const response = {
                ...detailedStation,
                parkingPlaces: parkingPlacesData.map(place => ({
                    id: uuidv4(),
                    bikeCategories: place.bikeCategories.map(category => category.name),
                })),
            };

            return response;
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

    static async getBikeCategoryByName(categoryId) {
        try {
            const { rows } = await pool.query(stationQueries.getBikeCategoryById, [categoryId]);

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

    static async getAllBikeModels() {
        try {
            const { rows } = await pool.query(stationQueries.getAllBikeModels);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getBikeModelById(bikeModelId) {
        try {
            const queryString = 'SELECT * FROM bike_models WHERE id = $1';
            const { rows } = await pool.query(queryString, [bikeModelId]);

            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async createBikeModel(bikeModelData) {
        const { name, description, wheelSize, extraFeatures, categoryId } = bikeModelData;
        const newBikeModelId = uuidv4();

        try {
            const queryText = `
                INSERT INTO bike_models (id, name, description, wheel_size, extra_features, category_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const { rows } = await pool.query(queryText, [newBikeModelId, name, description, wheelSize, extraFeatures, categoryId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async deleteBikeModel(modelId) {
        try {

            const deleteResult = await pool.query(stationQueries.deleteBikeModel, [modelId]);

            return deleteResult.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getAllIndividualBikes() {
        try {
            const { rows } = await pool.query(stationQueries.getAllIndividualBikes);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async createIndividualBike(individualBikeData) {
        try {

            const newIndividualBike = await pool.query(stationQueries.createIndividualBike, [
                uuidv4(),
                individualBikeData.bike_category,
                individualBikeData.status,
                individualBikeData.bike_model_id,
            ]);

            return newIndividualBike.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async deleteIndividualBikeById(bikeId) {
        try {

            const deleteResult = await pool.query(stationQueries.deleteIndividualBikeById, [bikeId]);

            return deleteResult.rowCount > 0;
        } catch (error) {
            throw error;
        }
    }



    static async findById(bikeId) {
        try {
            const query = stationQueries.findIndividualBikeById;
            const values = [bikeId];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateParkingPlace(bikeId, parkingPlaceId) {
        try {
            const query = stationQueries.updateIndividualBikeParkingPlace;
            const values = [parkingPlaceId, bikeId];
            await pool.query(query, values);
        } catch (error) {
            throw error;
        }
    }


    static async findAvailableParkingPlace(stationId, bikeCategory) {
        try {
            const query = stationQueries.findAvailableParkingPlace;
            const values = [stationId, bikeCategory];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async markParkingPlaceAsVacant(parkingPlaceId) {
        try {
            const query = stationQueries.markParkingPlaceAsVacant;
            const values = [parkingPlaceId];
            await pool.query(query, values);
        } catch (error) {
            throw error;
        }
    }

    static async markParkingPlaceAsOccupied(parkingPlaceId) {
        try {
            const query = stationQueries.markParkingPlaceAsOccupied;
            const values = [parkingPlaceId];
            await pool.query(query, values);
        } catch (error) {
            throw error;
        }
    }

    static async getCategoryNameById(categoryId) {
        try {
            const result = await pool.query(queries.getCategoryNameByIdQuery, [categoryId]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0].name;
        } catch (error) {
            throw error;
        }
    }

    static async getBikeModelString(categoryId) {
        try {
            const query = 'SELECT name FROM bike_categories WHERE id = $1';
            const values = [categoryId];
            const result = await pool.query(query, values);
            if (result.rows.length > 0) {
                return result.rows[0].name;
            } else {
                return null;
            }
        } catch (error) {

        }
    }

}

module.exports = StationModel;
