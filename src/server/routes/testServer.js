module.exports = function (app, db) {

    var stubData = {
        "thermometers": [
           {
               "id": 0,
               "temp": 62.04,
               "highAlarm": 215.0000000000,
               "lowAlarm": 32.0000000000,
               "sensor": 4032169102500196
           },
           {
               "id": 1,
               "temp": 62.82,
               "highAlarm": 215.0000000000,
               "lowAlarm": 32.0000000000,
               "sensor": 40118328050033
           },
           {
               "id": 2,
               "temp": 61.47,
               "highAlarm": 215.0000000000,
               "lowAlarm": 32.0000000000,
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
        "whichThermoAlarm": 3,
        "clearTimers": 1,
        "timers": [

        ],
        "timersNotAllocated": 8,
        "totalTimers": 12,
        "pumpOn": 0,
        "auxOn": 1,
        "rimsEnable": 0,
        "arduinoTime": 61,
        "arduinoTimeLong": "0:01:01 1/1/1970",
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
    app.get('/sendCommand/:whichCmd/:val', sendCommand);

    function getStubData(request, response, next) {

        response.send(stubData);
        response.end;
    };

    function getChartData(request, response, next) {
        db.all("SELECT strftime('%Y',dt) as year, strftime('%m',dt) as month, strftime('%d',dt) as day, strftime('%H',dt) as hour, strftime('%M',dt) as minute, strftime('%S',dt) as second, datetime(dt, 'localtime') as dt, temp0, temp1, temp2, temp3 FROM TemperatureHistories limit 300", function (err, rows) {
            //    console.log('you requested data' + rows);
            console.log('error is:', err);
            console.log(rows.length);
            response.json(rows);
        });
    }

    function clearSessionData(req, res, next) {
        db.serialize(function () {
            db.run('Delete from TemperatureHistories');
        });
    }

    function sendCommand(request, response, next) {
        console.log('you just got a get');
        console.log('request.params.whichCmd = ' + request.params.whichCmd);
        console.log('request.params.val = ' + request.params.val);
        response.send('success');
        response.end;
    }

    setInterval(randomizeStubData, 10000);

    function randomizeStubData() {
        stubData.thermometers.forEach(function (element, index, array) {
            element.temp = element.temp + (Math.random() - 0.2);
        });
        insertTemperatureHistories(stubData.thermometers[0].temp, stubData.thermometers[1].temp, stubData.thermometers[2].temp, stubData.thermometers[3].temp);
    }

    function insertTemperatureHistories(t0, t1, t2, t3) {
        db.serialize(function () {
            db.run('INSERT INTO TemperatureHistories (temp0, temp1, temp2, temp3) VALUES (?,?,?,?)', t0, t1, t2, t3);

        });
    }

};