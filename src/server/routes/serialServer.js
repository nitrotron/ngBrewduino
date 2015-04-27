module.exports = function (app, db) {

    var sleep = require('sleep');
    var serialport = require('serialport');
    // configure the serial port:
    var SerialPort = serialport.SerialPort;     // make a local instance of serialport
    //portName = process.argv[2],             // get serial port name from the command line
    var portName = '/dev/ttyACM0';
    var serialOptions = {                       // serial communication options
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
        
        console.log('just recieved: ' + data);
        // save the incoming serial data in serialData variable
        var jData = {};
	try {
		jData = JSON.parse(data);
	} catch (e) {
		console.log('JSON Error:' + e);
 	}



        if (jData.hasOwnProperty('DATALOGGING')) {
            insertTemperatureHistories(jData.DATALOGGING.temp0, jData.DATALOGGING.temp1, jData.DATALOGGING.temp2, jData.DATALOGGING.temp3);
        }
        else if (jData.hasOwnProperty('noSensors')) {
            console.log('just closing port');
            myPort.close(function (error) {
                console.log('port should now be closed');
                sleep.sleep(1);
                console.log('done sleeping');
                // lets reopen a port
                myPort.open(); // = new SerialPort(portName, serialOptions);
                console.log('done creating new port');
                // set up event listeners for the serial events:
                myPort.on('open', showPortOpen);
                myPort.on('data', saveLatestData);
                myPort.on('error', showError);
            });
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
    app.get('/clearSessionData', clearSessionData);
    app.post('/createNewSession', createNewSession);
    app.get('/sendCommand/:whichCmd/:val', sendCommand);

    function getStatus(request, response, next) {

        response.send(serialData);
        response.end;
    };

    //function getChartData(request, response, next) {
    //    db.all("SELECT datetime(dt, 'localtime') as date,  temp0, temp1, temp2, temp3 FROM TemperatureHistories", function (err, rows) {
    //        response.json(rows);
    //    });
    //}
    function getChartData(request, response, next) {
        db.all("SELECT  * from (select ROWID, strftime('%Y',dt,  'localtime') as year, strftime('%m',dt, 'localtime') as month, strftime('%d',dt, 'localtime') as day, strftime('%H',dt, 'localtime') as hour, strftime('%M',dt, 'localtime') as minute, strftime('%S',dt, 'localtime') as second, datetime(dt, 'localtime') as dt, temp0, temp1, temp2, temp3 FROM TemperatureHistories order by ROWID desc limit 300) order by ROWID asc", function (err, rows) {
            //    console.log('you requested data' + rows);
            //    console.log('error is:', err);
            console.log('number of chart rows: ' + rows.length);
            response.json(rows);
        });
    }

    function clearSessionData(req, res, next) {
        db.serialize(function () {
            db.run('Delete from TemperatureHistories');
        });
    }

    function createNewSession(req, res, next) {
        var sessionName = req.body.sessionName;
        db.run('INSERT INTO Sessions (sessionName) VALUES (?)', sessionName);

        console.log('just received sessionName:' + sessionName);
        res.send('Created Session Name: ' + sessionName);
    }

    function sendCommand(request, response, next) {
        console.log('you just got a get');
        console.log('request.params.whichCmd = ' + request.params.whichCmd);
        console.log('request.params.val = ' + request.params.val);
        var fullCmd = request.params.whichCmd + ',' + request.params.val + ';';
        myPort.write(fullCmd);
        response.send('success');
        response.end;
    }



    function insertTemperatureHistories(t0, t1, t2, t3) {
        db.serialize(function () {
            db.run('INSERT INTO TemperatureHistories (temp0, temp1, temp2, temp3) VALUES (?,?,?,?)', t0, t1, t2, t3);

        });
    }



};