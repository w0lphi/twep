const express = require('express');
const router = express.Router();
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
};

module.exports = stationController;
