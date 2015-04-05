﻿// include the various libraries that you'll use:
//ser var serialport = require('serialport'), // include the serialportlibrary
/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
//var bodyParser = require('body-parser');
//var compress = require('compression');
//var cors = require('cors');
//var errorHandler = require('./routes/utils/errorHandler')();
//var favicon = require('serve-favicon');
//var logger = require('morgan');
var port = process.env.PORT || 7200;
var routes;

var environment = process.env.NODE_ENV;

//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());
//app.use(compress());            // Compress response data with gzip
//app.use(logger('dev'));
//app.use(favicon(__dirname + '/favicon.ico'));
//app.use(cors());                // enable ALL CORS requests
//app.use(errorHandler.init);

//routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

var source = '';

var stubData = {
    thermometers: [
        { id: 0, temp: 100, highAlarm: 200, lowAlarm: 15, name: 'RIMs', isRIMS: true },
        { id: 1, temp: 110, highAlarm: 210, lowAlarm: 25, name: 'Mash' },
        { id: 2, temp: 120, highAlarm: 220, lowAlarm: 35, name: 'HLT' },
        { id: 3, temp: 130, highAlarm: 230, lowAlarm: 45, name: 'Kettle' }
    ],

    //Thermometer0: 100,
    //ThermometerHighAlarm0: 200,
    //ThermometerLowAlarm0: 40,
    TotalTimers: 12,
    rimsEnable: false,
    auxOn: false,
    pumpOn: false,
    WhichThermoAlarm: 'kettle',
    TimersNotAllocated: 3,
    Kp: 200,
    Ki: 1,
    kd: 1,
    SetPoint: 100,
    WindowSize: 5000,
    TempAlarmActive: false,
    TimerAlarmActive: false
};

app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});

switch (environment){
    case 'production':
        console.log('** PRODUCTION ON AZURE **');
        console.log('serving from ' + './build/');
        process.chdir('./../../');
        app.use('/', express.static('./build/'));
        break;
    case 'stage':
    case 'build':
        console.log('** BUILD **');
        console.log('serving from ' + './build/');
        app.use('/', express.static('./build/'));
        break;
    default:
        console.log('** DEV **');
        console.log('serving from ' + './src/client/ and ./');
        app.use('/', express.static('./src/client/'));
        app.use('/', express.static('./'));
        break;
}

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname  +
    '\nprocess.cwd = ' + process.cwd());
});


////********************************************** origi
//var express = require('express'),           // include express.js
//app = express();                        // a local instance of it
//
//// configure the serial port:
////serSerialPort = serialport.SerialPort,     // make a local instance of serialport
////serportName = process.argv[2],             // get serial port name from the command line
////serserialOptions = {                       // serial communication options
////ser    baudRate: 9600,                       // data rate: 9600 bits per second
////ser    parser: serialport.parsers.readline('\r\n') // return and newline generate data event
////ser};
////servar serialData = 0;                     // variable to save latest data from serial port
//
//// open the serial port:
////servar myPort = new SerialPort(portName, serialOptions);
//
//// set up event listeners for the serial events:
////sermyPort.on('open', showPortOpen);
////sermyPort.on('data', saveLatestData);
////sermyPort.on('error', showError);
//
//// Tell the server where files to serve are located:
//app.use(express.static('../build'));
//
//// start the server:
//var server = app.listen(8080);
//// start the listener for client requests:
app.get('/getStatus', getStubData);        // handler for /date

function getStubData(request, response) {
    response.send(stubData);
    response.end;
};
//
//// ------------------------ Serial event functions:
//// this is called when the serial port is opened:
//function showPortOpen() {
//    console.log('port open. Data rate: ' + myPort.options.baudRate);
//}
//
//// this is called when new data comes into the serial port:
//function saveLatestData(data) {
//    // save the incoming serial data in serialData variable
//    //serserialData = data;
//}
//
//// this is called when the serial port has an error:
//function showError(error) {
//    console.log('Serial port error: ' + error);
//}
//
//// ------------------------ Server event functions
//// respond to the client request with the latest serial data:
//function sendData(request, response) {
//    response.send(serialData);
//    response.end();
//};



