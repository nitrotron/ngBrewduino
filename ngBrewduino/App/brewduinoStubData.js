/**
 * Created by jessica on 1/1/2015.
 */
(function () {
    var chartData = {};
    chartData.type = 'LineChart';
    chartData.cssStyle = 'height:200px; width:100%; float:left;';
    chartData.data = {
        'cols': [],
        'rows': []
    };
       
    
    chartData.data.cols.push({
        'id': 'Time',
        'label': 'Time',
        'type': 'string',
        'p': {}
    });
    chartData.data.cols.push({
        'id': 't0',
        'label': 'RIMS',
        'type': 'number',
        'p': {}
    });
    chartData.data.cols.push({
        'id': 't1',
        'label': 'Kettle',
        'type': 'number',
        'p': {}
    });
    chartData.data.cols.push({
        'id': 't2',
        'label': 'Mash',
        'type': 'number',
        'p': {}
    });
    chartData.data.cols.push({
        'id': 't3',
        'label': 'HLT/Kettle2',
        'type': 'number'
    });

    chartData.data.rows.push(constRowObj('10:30', 115, 86, 100, 200));
    chartData.data.rows.push(constRowObj('10:31', 117, 86, 110, 200));
    chartData.data.rows.push(constRowObj('10:32', 118, 86, 120, 200));
    chartData.data.rows.push(constRowObj('10:33', 115, 86, 130, 200));
    chartData.data.rows.push(constRowObj('10:34', 120, 85, 145, 200));
    chartData.data.rows.push(constRowObj('10:35', 123, 84, 150, 200));
    chartData.data.rows.push(constRowObj('10:36', 123, 83, 155, 200));
    chartData.data.rows.push(constRowObj('10:37', 125, 86, 156, 200));
    chartData.data.rows.push(constRowObj('10:38', 125, 85, 158, 200));
    chartData.data.rows.push(constRowObj('10:39', 126, 86, 159, 200));
    chartData.data.rows.push(constRowObj('10:40', 128, 85, 160, 200));
    chartData.data.rows.push(constRowObj('10:41', 128, 86, 160, 200));
        


    chartData.options = {
        'title': 'Temperatures',
        'isStacked': 'true',
        'fill': 20,
        'curveType': 'function',
        'trendlines' : {
            1: {}
        },
        'displayExactValues': true,
        'vAxis': {
            'title': 'Temperature unit', 'gridlines': { 'count': 6 }
        },
        'hAxis': {
            'title': 'Date'
        }
};

    chartData.formatters = {};

    function constRowObj(time, t0, t1, t2, t3) {
        return {
            'c': [{
                'v': time
            }, {
                'v': t0
            }, {
                'v': t1
            }, {
                'v': t2
            }, {
                'v': t3
            }]
        };
    }


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
    RimsEnable: false,
    AuxOn: false,
    PumpOn: false,
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

angular.module('app')
    .value('stubData', stubData)
    .value('chartData', chartData);
})();
