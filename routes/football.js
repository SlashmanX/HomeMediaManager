var express = require('express');
var router = express.Router();
var superagent = require('superagent');

var settings = require('../conf/settings.json');

var API_URL = 'http://www.football-data.org/'
var FIXTURES_URL = 'soccerseasons/';
var PREM_ID = '354';
var API_KEY = '63b2483708cb44c1b1a2bef14f8bfe87';

/* GET home page. */
router.get('/', function(req, res) {
	superagent
	.get('http://www.football-data.org/soccerseasons/354/fixtures?timeFrame=n7')
	.set('Auth-Token', API_KEY)
	.set('User-Agent', 'tallorderhq 0.0.1 by SlashmanX')
	.end(function(result) {
		var fixtures = JSON.parse(result.text);

		superagent
		.get('http://www.football-data.org/soccerseasons/354/ranking')
		.set('Auth-Token', API_KEY)
		.set('User-Agent', 'tallorderhq 0.0.1 by SlashmanX')
		.end(function(result) {
			var rankings = JSON.parse(result.text).ranking;
			res.render('football', { title: 'Football - '+ settings.site_name, fixtures: fixtures, rankings: rankings });
		});
	});
});

module.exports = router;
