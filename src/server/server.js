// include the various libraries that you'll use:
//ser var serialport = require('serialport'), // include the serialportlibrary
var express = require('express'),           // include express.js
app = express();                        // a local instance of it

// configure the serial port:
//serSerialPort = serialport.SerialPort,     // make a local instance of serialport
//serportName = process.argv[2],             // get serial port name from the command line
//serserialOptions = {                       // serial communication options
//ser    baudRate: 9600,                       // data rate: 9600 bits per second
//ser    parser: serialport.parsers.readline('\r\n') // return and newline generate data event
//ser};
//servar serialData = 0;                     // variable to save latest data from serial port

// open the serial port:
//servar myPort = new SerialPort(portName, serialOptions);

// set up event listeners for the serial events:
//sermyPort.on('open', showPortOpen);
//sermyPort.on('data', saveLatestData);
//sermyPort.on('error', showError);

// Tell the server where files to serve are located:
app.use(express.static('../build'));

// start the server:
var server = app.listen(8080);
// start the listener for client requests:
app.get('/data', sendData);        // handler for /date

// ------------------------ Serial event functions:
// this is called when the serial port is opened:
function showPortOpen() {
    console.log('port open. Data rate: ' + myPort.options.baudRate);
}

// this is called when new data comes into the serial port:
function saveLatestData(data) {
    // save the incoming serial data in serialData variable
    //serserialData = data;
}

// this is called when the serial port has an error:
function showError(error) {
    console.log('Serial port error: ' + error);
}

// ------------------------ Server event functions
// respond to the client request with the latest serial data:
function sendData(request, response) {
    response.send(serialData);
    response.end();
};