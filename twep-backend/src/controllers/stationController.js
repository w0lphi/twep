const StationModel = require('../models/stationModel');

const getStations = async (req, res) => {
    try {
        const stations = await StationModel.getAllStations();
        res.status(200).json(stations);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getStationById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const station = await StationModel.getStationById(id);
        if (!station) {
            res.status(404).json({ error: 'Station not found' });
            return;
        }
        res.status(200).json(station);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createStation = async (req, res) => {
    const { coordinates, bikeSpaces, operational } = req.body;

    try {
        const newStation = await StationModel.createStation({
            coordinates,
            bikeSpaces,
            operational,
        });

        res.status(201).json(newStation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateStation = async (req, res) => {
    const id = parseInt(req.params.id);
    const { coordinates, bikeSpaces, operational } = req.body;

    try {
        const existingStation = await StationModel.getStationById(id);
        if (!existingStation) {
            res.status(404).json({ error: 'Station not found' });
            return;
        }

        const updatedStation = await StationModel.updateStation(id, {
            coordinates,
            bikeSpaces,
            operational,
        });

        res.status(200).json(updatedStation);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteStation = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const existingStation = await StationModel.getStationById(id);
        if (!existingStation) {
            res.status(404).json({ error: 'Station not found' });
            return;
        }

        const deletedStation = await StationModel.deleteStation(id);
        res.status(200).json(deletedStation);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getStations,
    getStationById,
    createStation,
    updateStation,
    deleteStation,
};
