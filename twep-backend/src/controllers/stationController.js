const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const StationModel = require('../models/stationModel');
const UserModel = require('../models/userModel');

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

            const camelCaseStations = stations.map(station => convertKeysToCamelCase(station));

            const responseObject = {
                stations: camelCaseStations
            };

            res.json(responseObject);
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
            // Check if parkingPlaces is present and is an array
            if (!parkingPlaces || !Array.isArray(parkingPlaces)) {
                return res.status(400).json({ error: 'Invalid or missing parkingPlaces field in the request body.' });
            }

            // Convert bike categories array to an array of objects with 'name' property
            const parkingPlacesData = parkingPlaces.map(place => ({
                bikeCategories: place.bikeCategories.map(category => ({ name: category.name })),
                occupied: place.occupied,
            }));

            // Create a new station
            const newStation = await StationModel.createStation({ name, location, operational }, parkingPlacesData);

            // Convert keys to CamelCase before sending the response
            const camelCaseStation = convertKeysToCamelCase(newStation);

            res.status(201).json(camelCaseStation);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async updateStation(req, res){
        try {
            const id = req.params.id;
            const stationBikes = await UserModel.getBikesAtStation(id);
            if(stationBikes.length > 0){
                return res.status(400).json({ error: 'Cannot update station while there are still bikes associated with it' });
            }

            const { name, location, operational, parkingPlaces } = req.body;
            // Check if parkingPlaces is present and is an array
            if (!parkingPlaces || !Array.isArray(parkingPlaces)) {
                return res.status(400).json({ error: 'Invalid or missing parkingPlaces field in the request body.' });
            }

            // Convert bike categories array to an array of objects with 'name' property
            const parkingPlacesData = parkingPlaces.map(place => ({
                bikeCategories: place.bikeCategories.map(category => ({ name: category.name })),
                occupied: place.occupied,
            }));

            // Create a new station
            const newStation = await StationModel.updateStation(id, { name, location, operational }, parkingPlacesData);

            // Convert keys to CamelCase before sending the response
            const camelCaseStation = convertKeysToCamelCase(newStation);

            res.status(201).json(camelCaseStation);
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

            const bikes = await UserModel.getBikesAtStation(id);

            if(bikes.length > 0){
                return res.status(400).json({ error: 'Cannot delete station while there are still bikes associated with it' });
            }

            // Call the deleteStationById in model
            await StationModel.deleteStationById(id);

            res.json({ message: 'Station deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async getBikeCategoryById(req, res) {
        const { id } = req.params;

        try {
            // Check if the bike category exists
            const bikeCategory = await StationModel.getBikeCategoryById(id);

            if (!bikeCategory) {
                return res.status(404).json({ error: 'Bike category not found' });
            }

            const camelCaseBikeCategory = convertKeysToCamelCase(bikeCategory);
            res.json(camelCaseBikeCategory);
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
            const { name, hourPrice } = req.body;

            // Check if the bike category already exists
            const existingCategory = await StationModel.getBikeCategoryByName(name);

            if (existingCategory) {
                return res.status(400).json({ error: 'Bike category already exists in the database.' });
            }

            const newCategoryId = await StationModel.createBikeCategory({ name, hourPrice });

            res.json({ id: newCategoryId, message: 'Bike category created successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async updateBikeCategoryPrice(req, res){
        try{
            const id = req.params.id;

            const existingCategory = await StationModel.getBikeCategoryById(id);
            if(existingCategory === null){
                return res.status(404).json({error: 'Bike category not found'});
            }
            const hourPrice = Number(req.body.hourPrice);
            if(Number.isNaN(hourPrice) || hourPrice < 0){
                return res.status(400).json({error: 'Price of bike category must be a positive number'});
            }
            const updatedCategory = await StationModel.updateBikeCategoryPrice(id, hourPrice);
            return res.json(convertKeysToCamelCase(updatedCategory));
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

    async getBikeModelById(req, res) {
        const bikeModelId = req.params.id;

        try {
            const bikeModel = await StationModel.getBikeModelById(bikeModelId);

            if (!bikeModel) {
                return res.status(404).json({ error: 'Bike model not found' });
            }

            const camelCaseBikeModel = convertKeysToCamelCase(bikeModel);

            res.json(camelCaseBikeModel);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async createBikeModel(req, res) {
        try {
            const bikeModelData = req.body;
            const newBikeModel = convertKeysToCamelCase(await StationModel.createBikeModel(bikeModelData));
            res.status(201).json(newBikeModel);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Invalid input data' });
        }
    },

    async updateBikeModel(req, res) {
        try {
            const id = req.params.id;
            const bikes =  await StationModel.getBikesByModelId(id);
            if(bikes.length > 0){
                return res.status(400).send({error: 'Cannot update bike model while there are still bikes associated with it'});
            }
            const bikeModelData = req.body;
            const updatedBikeModel = convertKeysToCamelCase(await StationModel.updateBikeModel(id, bikeModelData));
            res.status(200).json(updatedBikeModel);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async deleteBikeModelById(req, res) {
        try {
            const { id } = req.params;
            const bikes =  await StationModel.getBikesByModelId(id);
            if(bikes.length > 0){
                return res.status(400).send({error: 'Cannot delete bike model while there are still bikes associated with it'});
            }

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

    async getIndividualBikeById(req, res) {
        const individualBikeId = req.params.id;
        try {
            const individualBike = await StationModel.findById(individualBikeId);
            if (!individualBike) {
                return res.status(404).json({ error: 'Bike not found' });
            }
            const camelCaseBike = convertKeysToCamelCase(individualBike);
            res.json(camelCaseBike);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async deleteIndividualBikeById(req, res) {
        try {
            const { id } = req.params;
            const individualBike = await StationModel.findById(id);
            if (!individualBike) {
                return res.status(404).json({ error: 'Individual bike not found' });
            }

            // Check if the individual bike is currently available
            if (!individualBike.status) {
                return res.status(400).json({ error: 'Individual bike is currently in use and cannot be reassigned' });
            }

            const tickets = await StationModel.getAllOpenTicketsForBike(id);            
            if(tickets.length > 0){
                return res.status(400).json({ error: 'Cannot delete individual bike while there are still active tickets associated with it' })
            }

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

    async reassignBike(req, res) {
        try {
            // Extract param from the request
            const { bikeId, targetStationId } = req.body;

            // Check if the individual bike exists
            const individualBike = await StationModel.findById(bikeId);
            if (!individualBike) {
                return res.status(404).json({ error: 'Individual bike not found' });
            }

            // Check if the individual bike is currently available
            if (!individualBike.status) {
                return res.status(400).json({ error: 'Individual bike is currently in use and cannot be reassigned' });
            }

            // Check if the target station exists
            const targetStation = await StationModel.getStationById(targetStationId);
            if (!targetStation) {
                return res.status(404).json({ error: 'Target station not found' });
            }

            const bikeCategoryString = await StationModel.getBikeCategoryString(individualBike.category_id);

            // Check if there is an available parking place for the bike category at the target station
            const availableParkingPlace = await StationModel.findAvailableParkingPlace(targetStationId, { name: bikeCategoryString });

            if (!availableParkingPlace) {
                return res.status(400).json({ error: 'Target station does not have an available parking place for the bike category' });
            }

            // Update the status of the old parking place to vacant
            await StationModel.markParkingPlaceAsVacant(individualBike.parking_place_id);

            // Update the individual bike's parking place ID in the database
            await StationModel.updateParkingPlace(bikeId, availableParkingPlace.id);

            // Update the status of the new parking place to occupied
            await StationModel.markParkingPlaceAsOccupied(availableParkingPlace.id);

            // Send a success response
            res.status(200).json({ message: 'Individual bike reassigned successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
}


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
