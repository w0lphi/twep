const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const StationModel = require('../models/stationModel');


const stationController = {
    async getStations(req, res) {
        try {
            const stations = await StationModel.getAllStations();
            res.json(stations);
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

            res.json(station);
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
            res.json(bikeCategories);
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

};

module.exports = stationController;
