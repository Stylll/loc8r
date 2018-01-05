var express = require('express');
var ctrlIndex = require('../controllers/main')
var router = express.Router();

/* GET home page. */
router.get('/', ctrlIndex.index);

module.exports = router;
