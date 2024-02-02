const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const StationModel = require('../models/stationModel');

const snakeCaseToCamelCase = (snakeCaseString) => {
    return snakeCaseString.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};


const stationController = {

    async getUsers(req, res) {
        try {
            const users = await StationModel.getAllUsers();

            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },


    async getStations(req, res) {
        try {
            const stations = await StationModel.getAllStations();

            // Convert snake_case keys to CamelCase
            const camelCaseStations = stations.map(station => convertKeysToCamelCase(station));

            res.json(camelCaseStations);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async getStationById(req, res) {
        const { id } = req.params;

        try {
            const station = await StationModel.getStationById(id);

            if (!station) {
                // Return 404 if the station with the specified ID is not found
                return res.status(404).json({ error: 'Station not found' });
            }

            const camelCaseStation = convertKeysToCamelCase(station);

            res.json(camelCaseStation);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async createStation(req, res) {
        const { name, location, operational, parkingPlaces } = req.body;

        try {
            // Convert bike categories array to an array of objects with 'name' property
            const parkingPlacesData = parkingPlaces.map(place => ({
                bike_categories: place.bike_categories.map(category => ({ name: category })),
                occupied: place.occupied,
            }));

            const newStationId = await StationModel.createStation({ name, location, operational }, parkingPlacesData);

            res.json({ id: newStationId });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async deleteStationById(req, res) {
        const { id } = req.params;

        try {
            const station = await StationModel.getStationById(id);

            if (!station) {
                // Return 404 if station not found
                return res.status(404).json({ error: 'Station not found' });
            }

            // Call the deleteStationById in model
            await StationModel.deleteStationById(id);

            res.json({ message: 'Station deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async getAllBikeCategories(req, res) {
        try {
            const bikeCategories = await StationModel.getAllBikeCategories();

            const camelCaseBikeCategories = bikeCategories.map(category => convertKeysToCamelCase(category));

            res.json(camelCaseBikeCategories);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async createBikeCategory(req, res) {
        try {
            const { name } = req.body;

            // Check if the bike category already exists
            const existingCategory = await StationModel.getBikeCategoryByName(name);

            if (existingCategory) {
                return res.status(400).json({ error: 'Bike category already exists in the database.' });
            }

            const newCategoryId = await StationModel.createBikeCategory({ name });

            res.json({ id: newCategoryId, message: 'Bike category created successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async deleteBikeCategoryById(req, res) {
        const { id } = req.params;

        try {
            // Check if the bike category exists
            const bikeCategory = await StationModel.getBikeCategoryById(id);

            if (!bikeCategory) {
                return res.status(404).json({ error: 'Bike category not found' });
            }

            await StationModel.deleteBikeCategoryById(id);

            res.json({ message: 'Bike category deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async getAllBikeModels(req, res) {
        try {
            const bikeModels = await StationModel.getAllBikeModels();

            const camelCaseBikeModels = bikeModels.map(model => convertKeysToCamelCase(model));

            res.json(camelCaseBikeModels);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async createBikeModel(req, res) {
        try {
            const bikeModelData = req.body;

            const newBikeModel = await StationModel.createBikeModel(bikeModelData);

            res.status(201).json({ bikeModel: newBikeModel, message: 'Bike model created successfully.' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Invalid input data' });
        }
    },

    async deleteBikeModelById(req, res) {
        const { id } = req.params;

        try {
            const deleteResult = await StationModel.deleteBikeModel(id);

            if (!deleteResult) {
                return res.status(404).json({ error: 'Bike model not found' });
            }

            res.json({ message: 'Bike model deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async getAllIndividualBikes(req, res) {
        try {
            const individualBikes = await StationModel.getAllIndividualBikes();

            const camelCaseIndividualBikes = individualBikes.map(bikeObject => convertKeysToCamelCase(bikeObject));


            res.json(camelCaseIndividualBikes);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async createIndividualBike(req, res) {
        try {
            const individualBikeData = req.body;

            const newIndividualBike = await StationModel.createIndividualBike(individualBikeData);

            res.status(201).json({ individualBike: newIndividualBike, message: 'Bike created successfully.' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Invalid input data' });
        }
    },

    async deleteIndividualBikeById(req, res) {
        const { id } = req.params;

        try {
            const deleteResult = await StationModel.deleteIndividualBikeById(id);

            if (!deleteResult) {
                return res.status(404).json({ error: 'Individual bike not found' });
            }

            res.json({ message: 'Individual bike deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

};

// Utility function to convert keys to CamelCase
function convertKeysToCamelCase(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => convertKeysToCamelCase(item));
    }

    const camelCaseObj = {};
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const camelCaseKey = snakeCaseToCamelCase(key);
            camelCaseObj[camelCaseKey] = convertKeysToCamelCase(obj[key]);
        }
    }

    return camelCaseObj;
}

module.exports = stationController;
