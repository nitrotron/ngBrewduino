module.exports = function (app, db) {

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
        "tempAlarmActive": 1,
        "timerAlarmActive": 0,
        "whichThermoAlarm": 0,
        "clearTimers": 1,
        "timers": [
            "18:28:24"
        ],
        "timersNotAllocated": 8,
        "totalTimers": 12,
        "acquireData": 1,
        "pumpOn": 1,
        "auxOn": 0,
        "rimsEnable": 1,
        "arduinoTime": 323932,
        "arduinoTimeLong": "17:58:52 4/1/1970",
        "setPoint": 100.00,
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
    app.get('/getChartData', getChartData);
    app.get('/clearSessionData', clearSessionData);
    app.post('/createNewSession', createNewSession);
    app.get('/sendCommand/:whichCmd/:val', sendCommand);
    app.get('/restartPort', restartPortAPI);

    function getStubData(request, response, next) {

        response.send(stubData);
        response.end;
    };

    function getChartData(request, response, next) {
        db.serialize(function () {
            var currentSession = 0;
            db.all("Select id from Sessions order by id desc limit 1", function (err, rows) {
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
                           "               th.temp3 AS temp3,                              " +
                           "               th.temp3 AS temp3,                              " +
                           "               th.temp3 AS temp3,                              " +
                           "               s.sessionName as sessionName                    " +
                           "        FROM   temperaturehistories as th                      " +
                           "        join   Sessions as s on th.sessionid = s.id            " +
                           "        WHERE  th.sessionid = $sessionID                       " +
                           "        ORDER  BY id DESC                                      " +
                           "        LIMIT  300)                                            " +
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

    function sendCommand(request, response, next) {
        console.log('you just got a get');
        console.log('request.params.whichCmd = ' + request.params.whichCmd);
        console.log('request.params.val = ' + request.params.val);
        response.send('success');
        response.end;
    }

    function restartPortAPI(req, res, next) {
        console.log('would be resetting the port');
    }

    setInterval(randomizeStubData, 10000);

    function randomizeStubData() {
        stubData.thermometers.forEach(function (element, index, array) {
            element.temp = element.temp + (Math.random() - 0.2);
        });
        stubData.output = (Math.random());
        insertTemperatureHistories(stubData.thermometers[0].temp, stubData.thermometers[1].temp, stubData.thermometers[2].temp, stubData.thermometers[3].temp, stubData.output, stubData.setPoint, stubData.kp, stubData.ki, stubData.kd);
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