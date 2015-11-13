// include the various libraries that you'll use:
//ser var serialport = require('serialport'), // include the serialportlibrary
/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
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


app.use(bodyParser.urlencoded({ extended: true }));
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

  

switch (environment) {

    case 'stage':
    case 'build':
        var oneMonth = 86400000 * 30;
        console.log('** BUILD **');
        console.log('serving from ' + './build/');
        app.use('/script', express.static('./build/script', { maxAge: oneMonth }));
        app.use('/font', express.static('./build/font', { maxAge: oneMonth }));
        app.use('/content', express.static('./build/content', { maxAge: oneMonth }));
        app.use('/', express.static('./build/'));
        break;
    default:
        console.log('** DEV **');
        console.log('serving from ' + './src/client/ and ./');
        app.use('/', express.static('./src/client/'));
        app.use('/', express.static('./'));
        break;
}

//app.listen(port, function () {
//    console.log('Express server listening on port ' + port);
//    console.log('env = ' + app.get('env') +
//    '\n__dirname = ' + __dirname +
//    '\nprocess.cwd = ' + process.cwd());
//});


var io = require('socket.io')(http);
http.listen(port);

if (useMock === 'enabled') {
    routes = require('./routes/testServer.js')(app, db, fs, io);
}
else {
    routes = require('./routes/serialServer.js')(app, db, fs, io);
}




//HeartBeat
//////////var heatbeatInterval = 60000;
//////////var heartbeatStartUpDelay = 60000;
//////////setTimeout(function () {
//////////    setInterval(function () {
//////////        console.log('about to send a heartbeat');
//////////        var request = http.get('http://localhost:' + port + '/getStatus', function (res) {
//////////            request.setTimeout(0); //disable timeout on response
//////////            if ([200, 302].indexOf(res.statusCode) == -1) {
//////////                console.log('reseting server due to statusCode:' + res.statusCode);
//////////                var filepath = './src/server/serverReset.js';
//////////                fs.closeSync(fs.openSync(filepath, 'w'));
//////////            }
//////////            else {
//////////                console.log('[heartbeat]: OK [' + res.statusCode + ']');
//////////            }
//////////        }).on('error', function (err) {
//////////            var filepath = './src/server/serverReset.js';
//////////            fs.closeSync(fs.openSync(filepath, 'w'));
//////////        });

//////////        request.setTimeout(10000, function () {
//////////            console.log('reseting server due to timeout');
//////////            var filepath = './src/server/serverReset.js';
//////////            fs.closeSync(fs.openSync(filepath, 'w'));
//////////        });
//////////    }, heatbeatInterval);
//////////}, heartbeatStartUpDelay);