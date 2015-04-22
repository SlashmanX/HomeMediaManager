var express = require('express');
var router = express.Router();
var peerflix = require('peerflix')

var settings = require('../conf/settings.json');

/* GENERAL */
router.post('/show', function(req, res) {
	var magnet = req.param('magnet');

	var engine = peerflix(magnet);
	engine.server.on('listening', function() {
		res.render('watch/show', { title: 'Watch - Show - '+ settings.site_name, url: req.hostname, port: engine.server.address().port});
	})
});

router.post('/movie', function(req, res) {
	var magnet = req.param('magnet');

	var engine = peerflix(magnet);
	engine.server.on('listening', function() {
		res.render('watch/movie', { title: 'Watch - Movie - '+ settings.site_name, url: req.hostname, port: engine.server.address().port});
	})
});



module.exports = router;
