const { Router } = require('express');
const stationController = require('../controllers/stationController');

const router = Router();

router.get('/', stationController.getStations);
router.get('/:id', stationController.getStationById);
router.post('/', stationController.createStation);
router.put('/:id', stationController.updateStation);
router.delete('/:id', stationController.deleteStation);

module.exports = router;
