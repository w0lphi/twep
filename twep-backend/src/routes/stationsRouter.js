const { Router } = require('express');
const stationController = require('../controllers/stationController');

const router = Router();

router.get('/stations', stationController.getStations);
router.get('/stations/:id', stationController.getStationById);

module.exports = router;
