const { Router } = require('express');
const stationController = require('../controllers/stationController');
const isAdmin = require('../middleware/isAdmin');
const verifyToken = require('../middleware/verifyToken');
const { v4: uuidv4 } = require('uuid');

const router = Router();

// Apply verifyToken middleware to all routes to verify the token
router.use(verifyToken);

router.use(isAdmin);

router.get('/users', stationController.getUsers);

router.get('/stations', stationController.getStations);
router.get('/stations/:id', stationController.getStationById);
router.post('/stations', stationController.createStation);
router.delete('/stations/:id', stationController.deleteStationById);

router.get('/bike-categories', stationController.getAllBikeCategories);
router.get('/bike-categories/:id', stationController.getBikeCategoryById);
router.post('/bike-categories', stationController.createBikeCategory);
router.delete('/bike-categories/:id', stationController.deleteBikeCategoryById);


router.get('/bike-models', stationController.getAllBikeModels);
router.get('/bike-models/:id', stationController.getBikeModelById);
router.post('/bike-models', stationController.createBikeModel);
router.delete('/bike-models/:id', stationController.deleteBikeModelById);

router.get('/bikes', stationController.getAllIndividualBikes);
router.post('/bikes', stationController.createIndividualBike);
router.delete('/bikes/:id', stationController.deleteIndividualBikeById);

router.post('/reassign-bikes', stationController.reassignBike);

module.exports = router;
