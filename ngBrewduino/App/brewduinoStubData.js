/**
 * Created by jessica on 1/1/2015.
 */
(function () {
    var chartData = {};
    chartData.type = 'LineChart';
    chartData.cssStyle = 'height:200px; width:300px; float:left;';
    chartData.data = {
        'cols': [
          {
              'id': 'Time',
              'label': 'Time',
              'type': 'string',
              'p': {}
          },
          {
              'id': 't0',
              'label': 'RIMS',
              'type': 'number',
              'p': {}
          },
          {
              'id': 't1',
              'label': 'Kettle',
              'type': 'number',
              'p': {}
          },
          {
              'id': 't2',
              'label': 'Mash',
              'type': 'number',
              'p': {}
          },
          {
              'id': 't3',
              'label': 'HLT/Kettle2',
              'type': 'number'
          }
        ],
        'rows': [
          {
              'c': [
                {
                    'v': '10:30'
                },
                {
                    'v': 115
                },
                {
                    'v': 86

                },
                {
                    'v': 100
                },
                {
                    'v': 200
                }
              ]
          },
          {
              'c': [
                {
                    'v': '10:30'
                },
                {
                    'v': 120
                },
                {
                    'v': 78
                },
                {
                    'v': 100
                },
                {
                    'v': 198
                }
              ]
          },
          {
              'c': [
                {
                    'v': '10:32'
                },
                {
                    'v': 125
                },
                {
                    'v': 99
                },
                {
                    'v': 103
                },
                {
                    'v': 195
                }
              ]
          },

          {
              'c': [
                {
                    'v': '10:33'
                },
                {
                    'v': 125
                },
                {
                    'v': 70
                },
                {
                    'v': 103
                },
                {
                    'v': 197
                }
              ]
          },
          {
              'c': [
                {
                    'v': '10:34'
                },
                {
                    'v': 125
                },
                {
                    'v': 70
                },
                {
                    'v': 103
                },
                {
                    'v': 197
                }
              ]
          },
          {
              'c': [
                {
                    'v': '10:35'
                },
                {
                    'v': 125
                },
                {
                    'v': 70
                },
                {
                    'v': 103
                },
                {
                    'v': 197
                }
              ]
          }
        ]
    };



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
