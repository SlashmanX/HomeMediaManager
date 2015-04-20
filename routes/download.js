var express = require('express');
var router = express.Router();
var Transmission = require('transmission');
var showsearcher = require('showsearcher-x');
var moviesearcher = require('moviesearcher-x');
var katsearcher = require('katsearcher-x');

var settings = require('../conf/settings.json');

var transmission = new Transmission(settings.transmission);

/* SHOWS */
router.get('/shows', function(req, res) {
	res.render('download/shows', { title: 'TV Shows - Download -'+ settings.site_name });
});

router.post('/shows', function(req, res) {
	var opts = {};
	opts.name =req.param('show');
	opts.season =req.param('season');
	opts.episode =req.param('episode');
	opts.quality =req.param('quality');
	opts.seeds = req.param('seeds');
	opts.limit =req.param('limit');

	showsearcher(opts).then(function(data){
		res.render('download/shows', { title: 'TV Shows - Download -'+ settings.site_name, searchResults: data, formData : opts});
	});
});

router.post('/shows/add', function(req, res) {
	var opts = {};
	var url =req.param('url');

	transmission.addUrl(url, function(err, result){
		if(err) {
			console.log(err);
			res.send('500');
		}
		else res.send('200');
	});
});

/* MOVIES */
router.get('/movies', function(req, res) {
	res.render('download/movies', { title: 'Movies - Downoad -'+ settings.site_name });
});

router.post('/movies', function(req, res) {
	var opts = {};
	opts.name =req.param('movie');
	opts.quality =req.param('quality');
	opts.seeds = req.param('seeds');
	opts.limit =req.param('limit');

	moviesearcher(opts).then(function(data){
		res.render('download/movies', { title: 'Movies - Download - '+ settings.site_name, searchResults: data, formData : opts});
	});
});

router.post('/movies/add', function(req, res) {
	var opts = {};
	var url =req.param('url');

	transmission.addUrl(url, {'download-dir': setting.transmission.download-dir-movies}, function(err, result){
		if(err) {
			console.log(err);
			res.send('500');
		}
		else res.send('200');
	});
});

/* GENERAL */
router.get('/general', function(req, res) {
	res.render('download/general', { title: 'Download - General -'+ settings.site_name });
});

router.post('/general', function(req, res) {
	var opts = {};
	opts.name =req.param('name');
	opts.limit =req.param('limit');
	opts.seeds = req.param('seeds');

	katsearcher(opts).then(function(data){
		res.render('download/general', { title: 'Download - General - '+ settings.site_name, searchResults: data, formData : opts});
	});
});

router.post('/general/add', function(req, res) {
	var opts = {};
	var url =req.param('url');

	transmission.addUrl(url, function(err, result){
		if(err) {
			console.log(err);
			res.send('500');
		}
		else res.send('200');
	});
});

module.exports = router;
