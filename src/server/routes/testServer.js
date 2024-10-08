﻿module.exports = function (app, db, fs, io) {

    var port = process.env.PORT || 7200;
     

    var stubData = {
        "thermometers": [
           {
               "id": 0,
               "temp": 62.04,
               "highAlarm": 215.0123115000,
               "lowAlarm": 32.1234100000,
               "sensor": 4032169102500196
           },
           {
               "id": 1,
               "temp": 150.82,
               "highAlarm": 148.4115100000,
               "lowAlarm": 32.0041331000,
               "sensor": 40118328050033
           },
           {
               "id": 2,
               "temp": 61.47,
               "highAlarm": 215.0014130000,
               "lowAlarm": 32.0001413200,
               "sensor": 401711538050019
           },
           {
               "id": 3,
               "temp": 62.38,
               "highAlarm": 215.0000000000,
               "lowAlarm": 32.0000000000,
               "sensor": 4023116618150056,
               "isRims": 1
           }
        ],
        "tempAlarmActive": 0,
        "timerAlarmActive": 0,
        "whichThermoAlarm": 0,
        "clearTimers": 1,
        "timers": [
            
        ],
        "timersNotAllocated": 8,
        "totalTimers": 12,
        "acquireData": 1,
        "pumpOn": 1,
        "auxOn": 0,
        "rimsEnable": 1,
        "arduinoTime": 323932,
        "arduinoTimeLong": "17:58:52 4/1/1970",
        "setPoint": 120.00,
        "windowSize": 0,
        "kp": 2.00,
        "ki": 5.00,
        "kd": 1.00,
        "output": 0.00,
        "millis": 61792,
        "windowStartTime": 1395,
        "outputTime": 60442
    };

    app.get('/getStatus', getStubData);        // handler for /date
    app.get('/getChartData/:entryCount/:session', getChartData);
    app.get('/getChartData/:entryCount', getChartData);
    app.get('/getChartData', getChartData);
    app.get('/clearSessionData', clearSessionData);
    app.get('/getSessions', getSessions);
    app.post('/createNewSession', createNewSession);
    app.get('/sendCommand/:whichCmd/:val', sendCommand);

    app.get('/restartPort', restartPortAPI);

    function getStubData(request, response, next) {
        console.log('just got a request for status');
        io.emit('status', stubData);
        response.send(stubData);
        response.end;
    };




    function getChartData(request, response, next) {
        console.log('just got a getChartData Request');
        db.serialize(function () {
            var currentSession = 0;

            var entryLimit = "LIMIT  300)"
            console.log('has entry count =' + request.params.hasOwnProperty('entryCount'));
            if (request.params.hasOwnProperty('entryCount') && request.params.entryCount === "all") {
                entryLimit = ")";
                console.log("getting Max Entries");
            }
            else if (request.params.hasOwnProperty('entryCount') && !isNaN(request.params.entryCount)) {
                entryLimit = "LIMIT  " + request.params.entryCount + " )"
                console.log("gettting " + request.params.entryCount + "  entries");
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
                if (rows !== undefined && rows.length > 0) {
                    currentSession = rows[0].id;
                }


                if (currentSession > 0) {
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
                               if (typeof response.json === 'function') {
                                   console.log('looks like a function');
                                   response.json(rows);
                               }
                               else {
                                   console.log('looks like NOT a function:'+ response.json);
                                   response = JSON.stringify(rows);
                                   io.emit('chartData', response);
                               }
                           });
                }
                else {
                    response.json([]);
                }
            });


        });
    }

    function clearSessionData(req, res, next) {

        db.all("Select id from Sessions order by id desc limit 1", function (err, rows) {
            console.error(err);
            if (rows.length > 0) {
                currentSession = rows[0].id;
            }

            if (currentSession > 0) {
                db.run('Delete from TemperatureHistories where SessionID = $sessionID', { $sessionID: currentSession });
                console.log('deleting with session id = ' + currentSession);
            }
            else {
                console.log('not updating temperatures histories because no current session');
            }
        });


        res.send('Cleared temperature histories');
    }

    function createNewSession(req, res, next) {
        var sessionName = req.body.sessionName;
        db.run('INSERT INTO Sessions (sessionName) VALUES (?)', sessionName);

        console.log('just received sessionName:' + sessionName);
        res.send('Created Session Name: ' + sessionName);
    }

    function getSessions(req, res, next) {
        db.all("SELECT sessionName, id from Sessions  ORDER  BY id DESC", function (err, rows) {
            var l = (rows) ? rows.length : 0;
            console.log('number of Sessions rows: ' + l);
            res.json(rows);
        });

    }

    function sendCommand(request, response, next) {
        console.log('you just got a get');
        console.log('request.params.whichCmd = ' + request.params.whichCmd);
        console.log('request.params.val = ' + request.params.val);
        response.send('success');
        response.end;
    }

    function restartPortAPI(req, res, next) {
        console.log('would be resetting the port');
        var filepath = './src/server/serverReset.js';
        fs.closeSync(fs.openSync(filepath, 'w'));
        res.send('Port reset');

    }

    setInterval(randomizeStubData, 10000);

    var stubDataUpdateCount = 0;

    function iftttAlarm(statusData) {
        var http = require("http");
        var options = {
            hostname: 'maker.ifttt.com',
            port: 80,
            path: '/trigger/brewduino_alarm/with/key/[CHANGE THIS KEY]',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        var req = http.request(options, function (res) {
            console.log('Status: ' + res.statusCode);
            console.log('Headers: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            console.log("request Creation");
            res.on('data', function (body) {
                console.log('Body: ' + body);
            });
        });
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        console.log("past errors"); 
        // write data to request body
        var alarmType = '';
        var alarmMsg = '';
        
        if (statusData.tempAlarmActive === 1) {
            alarmType = 'Temperature Alarm-' + statusData.whichThermoAlarm;
            alarmMsg = 'Current Temperature: ' + statusData.thermometers[statusData.whichThermoAlarm].temp +
                ', High Alarm: ' + statusData.thermometers[statusData.whichThermoAlarm].highAlarm +
                ', Low Alarm: ' + statusData.thermometers[statusData.whichThermoAlarm].highAlarm;
        } 
        if (statusData.timerAlarmActive === 1) {
            alarmType = 'Timer Alarm';
        }
        var httpData = '{"value1": "' + alarmType + '","value2": "' + alarmMsg + '","value3":""}';
        console.log('Data: ' + httpData);
        req.write(httpData);
        req.end();
        console.log("sending request");
    }
    function randomizeStubData() {
        stubData.thermometers.forEach(function (element, index, array) {
            element.temp = element.temp + (Math.random() - 0.2);
        });
        if (stubData.tempAlarmActive === 0 && Math.random() < 0.05) {
            stubData.tempAlarmActive = 1;
            stubData.whichThermoAlarm = Math.floor(Math.random() * 3);
            // iftttAlarm(stubData);
        }
        stubData.output = (Math.random() * 1000);
        console.log("Updating data");
        io.emit('status', stubData);
        stubDataUpdateCount++;
        if (stubDataUpdateCount % 4 == 0) {
            insertTemperatureHistories(stubData.thermometers[0].temp, stubData.thermometers[1].temp, stubData.thermometers[2].temp, stubData.thermometers[3].temp, stubData.output, stubData.setPoint, stubData.kp, stubData.ki, stubData.kd);
        }
        
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
                    db.run('INSERT INTO TemperatureHistories (temp0, temp1, temp2, temp3, SessionID, rimsOnWindow, rimsSetPoint, rimsKp, rimsKi, rimskd) VALUES (?,?,?,?,?,?,?,?,?,?)', [t0, t1, t2, t3, currentSession, rimsOnWin, rimsSetPoint, kp, ki, kd], function () {
                        var chartResponse = {}, chartRequest = {};
                        chartRequest.params = {};

                        getChartData(chartRequest, chartResponse);
                    });
                }
                else {
                    console.log('not updating temperatures histories because no current session');
                }
            });


        });
    }

    io.on('connection', function (socket) {
        socket.emit('status', stubData);
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });


        socket.on('getStatus', function (from) {
            console.log('received a msg' + from);
            socket.emit('status', stubData);

        });

        socket.on('createTimer', function (timerObj) {
            console.log('Looks like a new timer was created');
            socket.broadcast.emit('newTimer', timerObj);
        });


    });




    };