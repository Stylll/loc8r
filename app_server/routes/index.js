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
router.get('/location/:locationid/review/new',ctrlLocations.addReview);
//POST add review page
router.post('/location/:locationid/review/new',ctrlLocations.doAddReview);

//Others pages
//GET about page
router.get('/about',ctrlOthers.about);

module.exports = router;
