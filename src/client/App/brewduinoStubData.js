/**
 * Created by jessica on 1/1/2015.
 */
(function () {
    var chartData = {};
    chartData.type = 'AreaChart';
    chartData.cssStyle = 'height:400px; width:100%; float:left;';
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
        'label': 'Mash',
        'type': 'number',
        'p': {}
    });
    chartData.data.cols.push({
        'id': 't2',
        'label': 'HLT/Kettle2',
        'type': 'number',
        'p': {}
    });
    chartData.data.cols.push({
        'id': 't3',
        'label': 'Kettle',
        'type': 'number'
    });

    chartData.data.rows.push(constRowObj('10:30', 115, 100, 106, 200));
    chartData.data.rows.push(constRowObj('10:31', 117, 110, 106, 208));
    chartData.data.rows.push(constRowObj('10:32', 118, 120, 106, 210));
    chartData.data.rows.push(constRowObj('10:33', 115, 130, 106, 205));
    chartData.data.rows.push(constRowObj('10:34', 120, 145, 105, 205));
    chartData.data.rows.push(constRowObj('10:35', 123, 150, 104, 204));
    chartData.data.rows.push(constRowObj('10:36', 123, 155, 103, 199));
    chartData.data.rows.push(constRowObj('10:37', 125, 156, 106, 201));
    chartData.data.rows.push(constRowObj('10:38', 125, 158, 105, 203));
    chartData.data.rows.push(constRowObj('10:39', 126, 159, 106, 206));
    chartData.data.rows.push(constRowObj('10:40', 128, 160, 105, 206));
    chartData.data.rows.push(constRowObj('10:41', 128, 160, 106, 208));



    chartData.options = {
        'title': 'Temperatures',
        'titleTextStyle': { 'color': '#D3D3D4' },
        'isStacked': 'false',
        'fill': 20,
        'curveType': 'function',
        'trendlines': {
            '0': {
                'type': 'linear',
                'color': 'green',
                'lineWidth': 3,
                'opacity': 0.3,
                'showR2': true,
                'visibleInLegend': true
            },
            '1': {
                'type': 'linear',
                'color': 'green',
                'lineWidth': '3',
                'opacity': '0.3',
                'showR2': 'true',
                'visibleInLegend': 'true'
            }
        },
        'displayExactValues': true,
        'vAxis': {
            'title': 'Temperature unit', 'gridlines': { 'count': 6, 'color': '#D3D3D4' },
            'titleTextStyle': { 'color': '#D3D3D4' },
            'textStyle': { 'color': '#D3D3D4' }
        },
        'hAxis': {
            'title': 'Date',
            'gridlines': {'color': '#D3D3D4' },
            'titleTextStyle': { 'color': '#D3D3D4' },
            'textStyle': { 'color': '#D3D3D4' }
        },
        'legend': { 'textStyle': { 'color': '#D3D3D4' }},

        'backgroundColor': '#353E42',
        'colors': ['#67DC2D', '#19fcfc', '#FC1919', '#FC8B19']
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
        rimsEnable: false,
        auxOn: false,
        pumpOn: false,
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
