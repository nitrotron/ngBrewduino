module.exports = function (app, db) {

    var serialPort = require('serialPort');
    // configure the serial port:
    var SerialPort = serialport.SerialPort;     // make a local instance of serialport
    //portName = process.argv[2],             // get serial port name from the command line
    var portName = '/dev/ttyAMC0';
    serialOptions = {                       // serial communication options
        baudRate: 9600,                       // data rate: 9600 bits per second
        parser: serialport.parsers.readline('\r\n') // return and newline generate data event
    };
    var serialData = {};                     // variable to save latest data from serial port

    // open the serial port:
    var myPort = new SerialPort(portName, serialOptions);

    // set up event listeners for the serial events:
    myPort.on('open', showPortOpen);
    myPort.on('data', saveLatestData);
    myPort.on('error', showError);

    // ------------------------ Serial event functions:
    // this is called when the serial port is opened:
    function showPortOpen() {
        console.log('port open. Data rate: ' + myPort.options.baudRate);
    }

    // this is called when new data comes into the serial port:
    function saveLatestData(data) {
        // save the incoming serial data in serialData variable
        var jData = JSON.parse(data);

        if (jData.hasOwnProperty('DATALOGGING')) {
            insertTemperatureHistories(jData.DATALOGGING.temp0, jData.DATALOGGING.temp1, jData.DATALOGGING.temp2, jData.DATALOGGING.temp3);
        }
        else {
            serialData = jData;
        }
        
    }

    // this is called when the serial port has an error:
    function showError(error) {
        console.log('Serial port error: ' + error);
    }


    app.get('/getStatus', getStatus);        // handler for /date
    app.get('/getChartData', getChartData);

    function getStatus(request, response, next) {

        response.send(serialData);
        response.end;
    };

    function getChartData(request, response, next) {
        db.all("SELECT datetime(dt, 'localtime') as date,  temp0, temp1, temp2, temp3 FROM TemperatureHistories", function (err, rows) {
            response.json(rows);
        });
    }




    function insertTemperatureHistories(t0, t1, t2, t3) {
        db.serialize(function () {
            db.run('INSERT INTO TemperatureHistories (temp0, temp1, temp2, temp3) VALUES (?,?,?,?)', t0, t1, t2, t3);

        });
    }



};