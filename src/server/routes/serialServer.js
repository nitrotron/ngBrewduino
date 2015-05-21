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
            insertTemperatureHistories(jData.DATALOGGING.temp0, jData.DATALOGGING.temp1, jData.DATALOGGING.temp2, jData.DATALOGGING.temp3, jData.DATALOGGING.output, jData.DATALOGGING.setPoint, jData.DATALOGGING.kp, jData.DATALOGGING.ki, jData.DATALOGGING.kd);
        }
        else if (jData.hasOwnProperty('noSensors')) {
            console.log('just closing port');
            myPort.close(restartPort);
        }
        else {
            serialData = jData;
        }

    }

    // this is called when the serial port has an error:
    function showError(error) {
        console.log('Serial port error: ' + error);
    }

    function restartPort(error) {
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
    }

    app.get('/getStatus', getStatus);        // handler for /date
    app.get('/getChartData', getChartData);
    app.get('/getChartData/:entryCount/:session', getChartData);
    app.get('/getChartData/:entryCount', getChartData);
    app.get('/clearSessionData', clearSessionData);
    app.post('/createNewSession', createNewSession);
    app.get('/sendCommand/:whichCmd/:val', sendCommand);
    app.get('/restartPort', restartPortAPI);

    function getStatus(request, response, next) {

        response.send(serialData);
        response.end;
    };

    //function getChartData(request, response, next) {
    //    db.all("SELECT datetime(dt, 'localtime') as date,  temp0, temp1, temp2, temp3 FROM TemperatureHistories", function (err, rows) {
    //        response.json(rows);
    //    });
    //}
    //function getChartData(request, response, next) {
    //    db.serialize(function () {
    //        var currentSession = 0;
    //        db.all("Select id from Sessions order by id desc limit 1", function (err, rows) {
    //            if (rows.length > 0) {
    //                currentSession = rows[0].id;
    //            }


    //            if (currentSession > 0) {
    //                //db.all("SELECT  * from (select th.ROWID, strftime('%Y',th.dt,  'localtime') as year, strftime('%m',th.dt, 'localtime') as month, strftime('%d',th.dt, 'localtime') as day, strftime('%H',th.dt, 'localtime') as hour, strftime('%M',th.dt, 'localtime') as minute, strftime('%S',th.dt, 'localtime') as second, datetime(th.dt, 'localtime') as dt, th.temp0, th.temp1, th.temp2, th.temp3, s.sessionName FROM TemperatureHistories th join Sesions s on s.id = th.SessionID where SessionID = $sessionID order by ROWID desc limit 300) order by ROWID asc", { $sessionID: currentSession }, function (err, rows) {
    //                db.all("SELECT *                                                       " +
    //                       "FROM   (SELECT th.id as id,                                    " +
    //                       "               Strftime('%Y', th.dt, 'localtime') AS year,     " +
    //                       "               Strftime('%m', th.dt, 'localtime') AS month,    " +
    //                       "               Strftime('%d', th.dt, 'localtime') AS day,      " +
    //                       "               Strftime('%H', th.dt, 'localtime') AS hour,     " +
    //                       "               Strftime('%M', th.dt, 'localtime') AS minute,   " +
    //                       "               Strftime('%S', th.dt, 'localtime') AS second,   " +
    //                       "               Datetime(th.dt, 'localtime')       AS dt,       " +
    //                       "               th.temp0 AS temp0,                              " +
    //                       "               th.temp1 AS temp1,                              " +
    //                       "               th.temp2 AS temp2,                              " +
    //                       "               th.temp3 AS temp3,                              " +
    //                       "               th.rimsOnWindow,                                " +
    //                       "               th.rimsSetPoint,                                " +
    //                       "               th.rimsKp, th.rimsKi, th.rimskd,                " +
    //                       "               s.sessionName as sessionName                    " +
    //                       "        FROM   temperaturehistories as th                      " +
    //                       "        join   Sessions as s on th.sessionid = s.id            " +
    //                       "        WHERE  th.sessionid = $sessionID                       " +
    //                       "        ORDER  BY id DESC                                      " +
    //                       "        LIMIT  300)                                            " +
    //                       "        ORDER  BY id ASC                                    ",
    //                       { $sessionID: currentSession },
    //                       function (err, rows) {
    //                           console.error(err);
    //                           console.log('number of chart rows: ' + rows.length);
    //                           response.json(rows);
    //                       });
    //            }
    //            else {
    //                response.json([]);
    //            }
    //        });


    //    });
    //}
    function getChartData(request, response, next) {
        db.serialize(function () {
            var currentSession = 0;

            var entryLimit = "LIMIT  300)"
            if (request.params.hasOwnProperty('entryCount') && request.params.entryCount === "all") {
                entryLimit = ")";
            }
            else if (request.params.hasOwnProperty('entryCount') && !isNaN(request.params.entryCount)) {
                entryLimit = "LIMIT  " + request.params.entryCount + " )"
                console.log("getting Max Entries")
            }
            else {
                console.log("poops");
                console.log(request.params.entryCount);
            }


            var sessionSQL = "Select id from Sessions order by id desc limit 1"
            if (request.params.hasOwnProperty('session')) {
                sessionSQL = "Select id from Sessions where sessionName = '" + request.params.session + "' order by id desc limit 1";
                console.log("session is now:" + request.params.session);
            }

            db.all(sessionSQL, function (err, rows) {
                if (rows.length > 0) {
                    currentSession = rows[0].id;
                }


                if (currentSession > 0) {
                    //db.all("SELECT  * from (select th.ROWID, strftime('%Y',th.dt,  'localtime') as year, strftime('%m',th.dt, 'localtime') as month, strftime('%d',th.dt, 'localtime') as day, strftime('%H',th.dt, 'localtime') as hour, strftime('%M',th.dt, 'localtime') as minute, strftime('%S',th.dt, 'localtime') as second, datetime(th.dt, 'localtime') as dt, th.temp0, th.temp1, th.temp2, th.temp3, s.sessionName FROM TemperatureHistories th join Sesions s on s.id = th.SessionID where SessionID = $sessionID order by ROWID desc limit 300) order by ROWID asc", { $sessionID: currentSession }, function (err, rows) {
                    db.all("SELECT *                                                       " +
                           "FROM   (SELECT th.id as id,                                    " +
                           "               Strftime('%Y', th.dt, 'localtime') AS year,     " +
                           "               Strftime('%m', th.dt, 'localtime') AS month,    " +
                           "               Strftime('%d', th.dt, 'localtime') AS day,      " +
                           "               Strftime('%H', th.dt, 'localtime') AS hour,     " +
                           "               Strftime('%M', th.dt, 'localtime') AS minute,   " +
                           "               Strftime('%S', th.dt, 'localtime') AS second,   " +
                           "               Datetime(th.dt, 'localtime')       AS dt,       " +
                           "               th.temp0 AS temp0,                              " +
                           "               th.temp1 AS temp1,                              " +
                           "               th.temp2 AS temp2,                              " +
                           "               th.temp3 AS temp3,                              " +
                           "               th.rimsOnWindow,                                " +
                           "               th.rimsSetPoint,                                " +
                           "               th.rimsKp, th.rimsKi, th.rimskd,                " +
                           "               s.sessionName as sessionName                    " +
                           "        FROM   temperaturehistories as th                      " +
                           "        join   Sessions as s on th.sessionid = s.id            " +
                           "        WHERE  th.sessionid = $sessionID                       " +
                           "        ORDER  BY id DESC                                      " +
                           entryLimit +
                           "        ORDER  BY id ASC                                    ",
                           { $sessionID: currentSession },
                           function (err, rows) {
                               console.error(err);
                               console.log('number of chart rows: ' + rows.length);
                               response.json(rows);
                           });
                }
                else {
                    response.json([]);
                }
            });


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

    function getSessions(req, res, next) {
        db.all("SELECT sessionName, id from Sessions  ORDER  BY id DESC", function (err, rows) {
            //db.all("Select id from Sessions order by id desc limit 1", function (err, rows) {
            console.log('number of Sessions rows: ' + rows.length);
            res.json(rows);
        });

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

    function restartPortAPI(req, res, next) {
        restartPort("from API");
    }


    function insertTemperatureHistories(t0, t1, t2, t3, rimsOnWin, rimsSetPoint, kp, ki, kd) {
        db.serialize(function () {
            var currentSession = 0;

            db.all("Select id from Sessions order by id desc limit 1", function (err, rows) {
                console.error(err);
                if (rows.length > 0) {
                    currentSession = rows[0].id;
                }

                if (currentSession > 0) {
                    db.run('INSERT INTO TemperatureHistories (temp0, temp1, temp2, temp3, SessionID, rimsOnWindow, rimsSetPoint, rimsKp, rimsKi, rimskd) VALUES (?,?,?,?,?,?,?,?,?,?)', t0, t1, t2, t3, currentSession, rimsOnWin, rimsSetPoint, kp, ki, kd);
                }
                else {
                    console.log('not updating temperatures histories because no current session');
                }
            });


        });
    }


};