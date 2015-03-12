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
              'id': 'month',
              'label': 'Month',
              'type': 'string',
              'p': {}
          },
          {
              'id': 'laptop-id',
              'label': 'Laptop',
              'type': 'number',
              'p': {}
          },
          {
              'id': 'desktop-id',
              'label': 'Desktop',
              'type': 'number',
              'p': {}
          },
          {
              'id': 'server-id',
              'label': 'Server',
              'type': 'number',
              'p': {}
          },
          {
              'id': 'cost-id',
              'label': 'Shipping',
              'type': 'number'
          }
        ],
        'rows': [
          {
              'c': [
                {
                    'v': 'January'
                },
                {
                    'v': 19,
                    'f': '42 items'
                },
                {
                    'v': 12,
                    'f': 'Ony 12 items'
                },
                {
                    'v': 7,
                    'f': '7 servers'
                },
                {
                    'v': 4
                }
              ]
          },
          {
              'c': [
                {
                    'v': 'February'
                },
                {
                    'v': 13
                },
                {
                    'v': 1,
                    'f': '1 unit (Out of stock this month)'
                },
                {
                    'v': 12
                },
                {
                    'v': 2
                }
              ]
          },
          {
              'c': [
                {
                    'v': 'March'
                },
                {
                    'v': 24
                },
                {
                    'v': 5
                },
                {
                    'v': 11
                },
                {
                    'v': 6
                }
              ]
          }
        ]
    };

    

    chartData.options = {
        'title': 'Sales per month',
        'isStacked': 'true',
        'fill': 20,
        'displayExactValues': true,
        'vAxis': {
            'title': 'Sales unit', 'gridlines': { 'count': 6 }
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
