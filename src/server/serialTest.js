var serialport = require('serialport'),// include the library
   SerialPort = serialport.SerialPort, // make a local instance of it
   // get port name from the command line:
   portName = process.argv[2];

var myPort = new SerialPort(portName, {
   baudRate: 9600,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\r\n")
 });

myPort.on('open', showPortOpen);
    myPort.on('data', saveLatestData);
    myPort.on('error', showError);

function showPortOpen() {
        console.log('port open. Data rate: ' + myPort.options.baudRate);
    }

 // this is called when the serial port has an error:
    function showError(error) {
        console.log('Serial port error: ' + error);
    }

// this is called when new data comes into the serial port:
    function saveLatestData(data) {
        // save the incoming serial data in serialData variable
        console.log('just recieved: ' + data);
        
    }