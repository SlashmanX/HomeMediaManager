var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var download = require('./routes/download');
var football = require('./routes/football');
var library = require('./routes/library');
var watch = require('./routes/watch');

var filesize = require('filesize');
var moment = require('moment');
var fs = require('fs');

var basicAuth = require('basic-auth');

var app = express();

var settings = require('./conf/settings.json');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var auth = function (req, res, next) {

	if(!settings.force_login) return(next());
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.send(401);
	};

	var user = basicAuth(req);

	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	};

	if (user.name === settings.site_login.username && user.pass === settings.site_login.password) {
		return next();
	} else {
		return unauthorized(res);
	};
};

app.use('/', auth, routes);
app.use('/download', auth, download);
app.use('/football', auth, football);
app.use('/library', auth, library);
app.use('/watch', auth, watch);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.locals.filesize = function(string, opts){
	return filesize(string, opts);
}

app.locals.moment = moment;

app.locals.sitename = settings.site_name;

app.locals.show_football = settings.show_football;
module.exports = app;
