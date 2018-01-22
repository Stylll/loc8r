var express = require('express');
var ctrlLocations = require('../controllers/locations')
var ctrlOthers = require('../controllers/others')
var router = express.Router();

//Location pages
/* GET home page. */
router.get('/', ctrlLocations.homelist);
//GET location info page
router.get('/location/:locationid',ctrlLocations.locationInfo);
//GET add review page
router.get('/location/review/new',ctrlLocations.addReview);

//Others pages
//GET about page
router.get('/about',ctrlOthers.about);

module.exports = router;
