const { Router } = require('express');
const stationController = require('../controllers/stationController');
const { v4: uuidv4 } = require('uuid');

const router = Router();

router.get('/stations', stationController.getStations);
router.get('/stations/:id', stationController.getStationById);
router.post('/stations', stationController.createStation);
router.delete('/stations/:id', stationController.deleteStationById);

router.get('/bike-categories', stationController.getAllBikeCategories);
router.post('/bike-categories', stationController.createBikeCategory);
router.delete('/bike-categories/:id', stationController.deleteBikeCategoryById);


router.get('/bike-models', stationController.getAllBikeModels);
router.post('/bike-models', stationController.createBikeModel);
router.delete('/bike-models/:id', stationController.deleteBikeModelById);

router.get('/bikes', stationController.getAllIndividualBikes);
router.post('/bikes', stationController.createIndividualBike);
router.delete('/bikes/:id', stationController.deleteIndividualBikeById);

module.exports = router;
