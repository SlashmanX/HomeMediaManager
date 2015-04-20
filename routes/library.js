var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var tv = new (require('tvragejs'))();
var Transmission = require('transmission');
var Q = require('q');
var showsearcher = require('showsearcher-x');
var moment = require('moment');

var settings = require('../conf/settings.json');

var transmission = new Transmission(settings.transmission);

var connection = mysql.createConnection(settings.xbmc_mysql);

connection.connect();

/* SHOWS */
router.get('/shows', function(req, res) {
	connection.query('SELECT tvshow.idShow AS showId, tvshow.c00 AS name, tvshow.c01 AS synopsis, ROUND(tvshow.c04, 1) AS rating, tvshow.c06 AS banner, tvshow.c11 AS fanart, (SELECT COUNT(*) FROM episode WHERE idShow = tvshow.idShow) AS numEpisodes FROM tvshow ORDER BY name ASC', function(err, rows, fields) {
		if (err) throw err;
		res.render('library/shows', { title: 'Library - TV Shows - '+ settings.site_name, shows: rows });
	});
});

router.get('/shows/:id', function(req, res) {
	getShowInfo(req.params.id).then(function(show){
		res.render('library/episodes', { title: show.info.name +' - '+ settings.site_name, show: show });
	});
});

router.get('/shows/:id/missing', function(req, res) {
	var missing = [];
	getShowInfo(req.params.id).then(function(show){
		tv.search(show.info.name, function(err, search){
			var tvrageId = search.show[0].showid;
			tv.episodeList(tvrageId, function(err, eps){
				eps.episodelist.season.forEach(function(seasonval, seasonindex, seasonarr) {
					var season = seasonval.$.no;
					for(var episode in seasonval.episode){
						if(!seasonval.episode[episode].seasonnum) {
							continue;
						}
						var episodeNum = parseInt(seasonval.episode[episode].seasonnum);
						var airdate = moment(seasonval.episode[episode].airdate);
						if((!show.episodes[season] || !show.episodes[season][episodeNum]) && airdate && airdate.isBefore(new moment())) {
							missing.push({
								season: season,
								episode: episodeNum,
								name: seasonval.episode[episode].title
							});
						}
					}
				})
				res.render('library/missing', { title: show.info.name +' - '+ settings.site_name, show: show, missing: missing });
			})
			
		})
	});
});

router.post('/shows/missing/download', function(req, res) {
	var missing = {
		name: req.param('name'),
		season: req.param('season'),
		episode: req.param('episode')
	}
	downloadEpisode(missing);
	res.send('200');
});

/* GET home page. */
router.get('/movies', function(req, res) {
	connection.query('SELECT idMovie AS movieId, c00 AS name, c01 AS synopsis, c03 AS tagline, ROUND(c05, 1) AS rating, c07 AS year, c08 AS poster, c09 AS imdbId, c20 AS fanart FROM movie ORDER BY name ASC', function(err, rows, fields) {
		if (err) throw err;
		res.render('library/movies', { title: 'Library - Movies - '+ settings.site_name, movies: rows });
	});
});

function downloadEpisode(info) {
	info.seeds = 1;

	showsearcher(info).then(function(data){
		if(data) {
			var first = data[0];
			console.log(first);
			transmission.addUrl(first.torrentData.magnetURI, function(err, result){});
		}
	});
}

function getShowInfo(id) {
	var defer = Q.defer();
	connection.query('SELECT tvshow.idShow AS showId, tvshow.c00 AS showName, tvshow.c01 AS showSynopsis, ROUND(tvshow.c04, 1) AS showRating, tvshow.c06 AS showBanner, tvshow.c11 AS showFanart, (SELECT COUNT(*) FROM episode WHERE idShow = tvshow.idShow) AS numEpisodes, episode.idEpisode AS episodeId, episode.idFile AS episodeFileId, episode.c00 AS episodeName, episode.c01 AS episodeSynopsis, ROUND(episode.c03, 1) AS episodeRating, episode.c05 AS episodeAirdate, episode.c06 AS episodeBanner, episode.c12 AS episodeSeason, episode.c13 AS episodeNumber FROM tvshow JOIN episode ON tvshow.idShow = episode.idShow WHERE tvshow.idShow = ? ORDER BY idEpisode ASC', id, function(err, rows, fields) {
		if(err) {
			defer.reject(err);
		}
		else {
			var show = {};
			show.info = {};
			show.episodes = {};
			rows.forEach(function(val, index, arr) {
				if(Object.keys(show.info).length === 0) {
					show.info.id = val.showId;
					show.info.name = val.showName;
					show.info.synopsis = val.showSynopsis;
					show.info.rating = val.showRating;
					show.info.banner = val.showBanner;
					show.info.fanart = val.showFanart;
					show.info.numEpisodes = val.numEpisodes;
				}
				if(!show.episodes[val.episodeSeason]) {
					show.episodes[val.episodeSeason] = {};
				}
				if(!show.episodes[val.episodeSeason][val.episodeNumber]) {
					show.episodes[val.episodeSeason][val.episodeNumber] = {};
				}

				show.episodes[val.episodeSeason][val.episodeNumber].id = val.episodeId
				show.episodes[val.episodeSeason][val.episodeNumber].fileId = val.episodeFileId;
				show.episodes[val.episodeSeason][val.episodeNumber].name = val.episodeName;
				show.episodes[val.episodeSeason][val.episodeNumber].synopsis = val.episodeSynopsis;
				show.episodes[val.episodeSeason][val.episodeNumber].rating = val.episodeRating;
				show.episodes[val.episodeSeason][val.episodeNumber].airdate = val.episodeAirdate;
				show.episodes[val.episodeSeason][val.episodeNumber].banner = val.episodeBanner;
				show.episodes[val.episodeSeason][val.episodeNumber].season = val.episodeSeason;
				show.episodes[val.episodeSeason][val.episodeNumber].episode = val.episodeNumber;


			})
			defer.resolve(show);
		}
	});

	return defer.promise;
}

module.exports = router;
