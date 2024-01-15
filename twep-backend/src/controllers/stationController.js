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

};

module.exports = stationController;
