// include the various libraries that you'll use:
//ser var serialport = require('serialport'), // include the serialportlibrary
/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
//var cors = require('cors');
//var errorHandler = require('./routes/utils/errorHandler')();
var favicon = require('serve-favicon');
//var logger = require('morgan');
var port = process.env.PORT || 7200;
var routes;

var environment = process.env.NODE_ENV;
var useMock = process.env.USE_MOCK;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compress());            // Compress response data with gzip
//app.use(logger('dev'));
app.use(favicon(__dirname + '/favicon.ico'));
//app.use(cors());                // enable ALL CORS requests
//app.use(errorHandler.init);

//routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);
console.log('USE_MOCK=' + useMock);

var source = '';

// ******************** SQL setup *******************************
var fs = require('fs');
var file = './data/' + 'brewduino.db';
var exists = fs.existsSync(file);

if (!exists) {
    console.log('Creating DB file.');
    fs.openSync(file, 'w');

}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);
if (!exists) {
    db.run('CREATE TABLE TemperatureHistories (id integer primary key autoincrement, temp0 DECIMAL(5,2), ' +
          ' temp1 DECIMAL(5,2), temp2 DECIMAL(5,2), temp3 DECIMAL(5,2), rimsOnWindow integer, rimsSetPoint integer, ' +
          ' rimsKp  integer, rimsKi  integer, rimsKd  integer, dt datetime default current_timestamp, SessionID integer)');
    db.run('CREATE TABLE Sessions (id integer primary key autoincrement, dt datetime default current_timestamp, sessionName NVARCHAR(100) )');
}
// ******************** SQL setup - END **************************


app.get('/ping', function (req, res, next) {
    console.log(req.body);
    res.send('pong');
});

if (useMock === 'enabled') {
    routes = require('./routes/testServer.js')(app, db);
}
else {
    routes = require('./routes/serialServer.js')(app, db);
}

switch (environment) {

    case 'stage':
    case 'build':
        var oneDay = 86400000;
        console.log('** BUILD **');
        console.log('serving from ' + './build/');
        app.use('/', express.static('./build/', { maxAge: oneDay }));
        break;
    default:
        console.log('** DEV **');
        console.log('serving from ' + './src/client/ and ./');
        app.use('/', express.static('./src/client/'));
        app.use('/', express.static('./'));
        break;
}

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});
