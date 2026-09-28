const express = require('express');
const { getUnits, getUnitById } = require('../controllers/unitController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes in this file

router.route('/').get(getUnits);
router.route('/:id').get(getUnitById);

module.exports = router;