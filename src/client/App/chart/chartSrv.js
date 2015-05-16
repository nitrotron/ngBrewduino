(function () {
    angular.module('app')
      .factory('chartSrv', chartSrv);

    /* @ngInject */
    function chartSrv($http, $interval, $q, settingsSrv) {
        var myCurrentChart = {};
        var chartConfig = {};
        var autoUpdatesEnabled = false;
        var chartTitle = 'Temperature';

        autoUpdates();
        activate();

        return {
            enableRims: enableRims,
            getChartConfig: getChartConfig,
            getChartData: getChartData,
            getCurrentData: getCurrentData,
            getCurrentChart: getCurrentChart,
            getEtaToAlarm: getEtaToAlarm,
            getTempSpeed: getTempSpeed,
            setAutoUpdates: setAutoUpdates
        };



        function autoUpdates() {
            //myCurrentChart = getChartConfig();
            //myCurrentChart.data.rows = getChartData();
            //$interval(function () {
            //    if (autoUpdatesEnabled === true) {
            //        getChartData();
            //    }
            //}, 60000);
        }

        function activate() {
            myCurrentChart = getChartConfig();
        }

        function enableRims(rimsOn) {
            //if (rimsOn) {
            //    chartConfig.options['series'] = {
            //        '0': { 'axis': 'rims', 'targetAxisIndex': 1 },
            //        '1': { 'axis': 'Temps', 'targetAxisIndex': 0 },
            //        '2': { 'axis': 'Temps', 'targetAxisIndex': 0 },
            //        '3': { 'axis': 'Temps', 'targetAxisIndex': 0 },
            //        '4': { 'axis': 'Temps', 'targetAxisIndex': 0 },
            //        '5': { 'axis': 'Temps', 'targetAxisIndex': 0 }

            //    };
            //    chartConfig.options['vAxis'] = {
            //        //'title': 'Temperature unit', 
            //        'gridlines': { 'count': 6, 'color': '#D3D3D4' },
            //        'titleTextStyle': { 'color': '#D3D3D4' },
            //        'textStyle': { 'color': '#D3D3D4' },
            //        '0': { 'title': 'Temps F' },
            //        '1': { 'title': 'rims' }
            //    };
            //}
            //else {
            //    chartConfig.options['series'] = {
            //        '0': { 'axis': 'Temps', 'targetAxisIndex': 0 },
            //        '1': { 'axis': 'Temps', 'targetAxisIndex': 0 },
            //        '2': { 'axis': 'Temps', 'targetAxisIndex': 0 },
            //        '3': { 'axis': 'Temps', 'targetAxisIndex': 0 },
            //        '4': { 'axis': 'Temps', 'targetAxisIndex': 0 },
            //        '5': { 'axis': 'Temps', 'targetAxisIndex': 0 }

            //    };
            //    chartConfig.options['vAxis'] = {
            //        //'title': 'Temperature unit', 
            //        'gridlines': { 'count': 6, 'color': '#D3D3D4' },
            //        'titleTextStyle': { 'color': '#D3D3D4' },
            //        'textStyle': { 'color': '#D3D3D4' }
            //    };

            //}
        }

        function getChartConfig() {
            chartConfig = {
                'options': {
                    'chart': {
                        'type': 'areaspline'
                    },
                    'plotOptions': {
                        'series': {
                            'stacking': ''
                        }
                    }
                },
                'xAxis': {
                    type: 'datetime',
                    dateTimeLabelFormats: { // don't display the dummy year
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                    },
                    title: {
                        text: 'Date'
                    }
                },
                'yAxis': [{
                    title: {
                        text: 'Temperatures'
                    },
                    min: 0
                },
                {
                    title: {
                        text: 'RIMs Window'
                    },
                    min: 0,
                    max: 1000,
                    opposite: true
                }],
                'series': [
    {
        'name': settingsSrv.thermos[0].name,
        'data': [
        ],
        'id': 0
    },
    {
        'name': settingsSrv.thermos[1].name,
        'data': [
        ],
        'id': 1
    },
    {
        'name': settingsSrv.thermos[2].name,
        'data': [
        ],
        'id': 2
    },
    {
        'name': settingsSrv.thermos[3].name,
        'data': [
        ],
        'id': 3
    },
    {
        'name': 'RIMs Setpoint',
        'data': [
        ],
        'id': 4,
        'visible': false
    },
    {
        'name': 'RIMS Window',
        'data': [
        ],
        'id': 5,
        'type': 'column',
        'yAxis': 1,
        'visible': false
    }
                ],

                'title': {
                    'text': 'Hello'
                },
                'credits': {
                    'enabled': false
                },
                'loading': false,
                'size': {
                    'width': '',
                    'height': '400'
                },
                'subtitle': {
                    'text': 'this is a subtitle'
                }
            };

            return chartConfig;
        }

        function getChartData() {
            var statusUrl = '/getChartData';

            var deferred = new $q.defer();


            $http.get(statusUrl).success(function (data) {

                var dataPts0 = [];
                var dataPts1 = [];
                var dataPts2 = [];
                var dataPts3 = [];
                var dataPts4 = [];
                var dataPts5 = [];
                if (data.length > 0) {
                    data.forEach(function (element, index, array) {
                        var dt = Date.UTC(element.year, element.month, element.day, element.hour, element.minute, element.second, 0);
                        dataPts0.push([dt, element.temp0]);
                        dataPts1.push([dt, element.temp1]);
                        dataPts2.push([dt, element.temp2]);
                        dataPts3.push([dt, element.temp3]);
                        dataPts4.push([dt, element.rimsSetPoint]);
                        dataPts5.push([dt, element.rimsOnWindow]);
                        //rows.push(constRowObj(dt, element.rimsOnWindow, element.rimsSetPoint,
                        //    element.temp0, element.temp1, element.temp2, element.temp3));
                    });

                    chartTitle = data[0]['sessionName'];
                }

                myCurrentChart.series[0].data = dataPts0;
                myCurrentChart.series[1].data = dataPts1;
                myCurrentChart.series[2].data = dataPts2;
                myCurrentChart.series[3].data = dataPts3;
                myCurrentChart.series[4].data = dataPts4;
                myCurrentChart.series[5].data = dataPts5;

                //myCurrentChart.series = [
                //    {
                //        'name': settingsSrv.thermos[0].name,
                //        'data': [
                //            [Date.UTC(1970, 9, 27), 0],
                //[Date.UTC(1980, 10, 10), 0.6],
                //[Date.UTC(1980, 10, 18), 0.7],
                //[Date.UTC(1980, 11, 2), 0.8],
                //[Date.UTC(1980, 11, 9), 0.6]
                //        ],
                //        'id': 0
                //    }
                //];

                //data = rows;
                deferred.resolve(data);
            });

            return deferred.promise;

        }

        function getCurrentData() {
            //return myCurrentChart.data.rows;
        }
        function getCurrentChart() {
            return myCurrentChart;
        }

        function getEtaToAlarm(whichThermo, highAlarm, lowAlarm) {
            //var speed = getTempSpeed(whichThermo);
            //var whichT = Number(whichThermo);
            //// currently assuming highAlarm

            //if (myCurrentChart.data.rows.length >= 2) {
            //    var lastRow = myCurrentChart.data.rows[myCurrentChart.data.rows.length - 1];
            //    var lastTemp = lastRow.c[whichT + 1].v;

            //    var tempDiff = Number(highAlarm) - lastTemp;

            //    return tempDiff / speed;
            //}
            //else {
            //    return 0;
            //}
        }
        function getTempSpeed(whichThermo) {
            //if (myCurrentChart.data.rows.length >= 2) {
            //    var whichT = Number(whichThermo);
            //    var lastRow = myCurrentChart.data.rows[myCurrentChart.data.rows.length - 1];
            //    var secondLastRow = myCurrentChart.data.rows[myCurrentChart.data.rows.length - 2];
            //    var tempDiff = lastRow.c[whichT + 1].v - secondLastRow.c[whichT + 1].v;
            //    var timeDiff = (new Date(lastRow.c[0].v) - new Date(secondLastRow.c[0].v)) / 60000;
            //    return Number(tempDiff) / Number(timeDiff);
            //}
            //else {
            //    return 0;
            //}
        }

        function constRowObj(time, onWin, setPt, t0, t1, t2, t3) {
            return {
                'c': [{
                    'v': time
                }, {
                    'v': onWin
                }, {
                    'v': setPt
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
        function setAutoUpdates(enableUpdates) {
            //autoUpdatesEnabled = enableUpdates;
        }
    }
})();