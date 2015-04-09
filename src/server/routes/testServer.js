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
        "auxOn": 0,
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

    function getStubData(request, response, next) {

        response.send(stubData);
        response.end;
    };

    function getChartData(request, response, next) {
        db.all("SELECT datetime(dt, 'localtime') as date,  temp0, temp1, temp2, temp3 FROM TemperatureHistories", function (err, rows) {
            response.json(rows);
        });
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