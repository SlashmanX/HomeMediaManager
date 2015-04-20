var express = require('express');
var router = express.Router();

var settings = require('../conf/settings.json');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: settings.site_name });
});

module.exports = router;
