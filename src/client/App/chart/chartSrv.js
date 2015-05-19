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
            // var colors = ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            //"#55BF3B", "#DF5353", "#7798BF", "#aaeeee"];
            chartConfig = {
                'options': {
                    'chart': {
                        'type': 'spline',
                        'zoomType': 'x',
                        'backgroundColor': {
                            'linearGradient': { x1: 0, y1: 0, x2: 1, y2: 1 },
                            'stops': [
                               [0, '#2a2a2b'],
                               [1, '#3e3e40']
                            ]
                        },
                        'plotOptions': {
                            'series': {
                                'stacking': '',
                                'marker': {
                                    'radius': 1
                                }
                            }

                        },
                        plotBorderColor: '#606063'
                    },
                    colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                                "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"]
                },
                'xAxis': {
                    type: 'datetime',
                    dateTimeLabelFormats: { // don't display the dummy year
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                    },
                    title: {
                        text: 'Time',
                        style: {
                            color: '#A0A0A3'

                        }
                    },
                    minRange: 60000 * 3, // 3 minutes
                    gridLineColor: '#707073',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    tickColor: '#707073'

                },
                'yAxis': [{
                    gridLineColor: '#707073',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    tickColor: '#707073',
                    tickWidth: 1,
                    title: {
                        text: 'Temperatures',
                        style: {
                            color: '#A0A0A3'
                        }
                    },
                    min: 64

                },
                {
                    gridLineColor: '#707073',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    tickColor: '#707073',
                    tickWidth: 1,
                    title: {
                        text: 'RIMs Window',
                        style: {
                            color: '#A0A0A3'
                        }
                    },
                    opposite: true
                }],
                'series': [
                            {
                                'name': settingsSrv.thermos[0].name,
                                'data': [],
                                'id': 0
                            },
                            {
                                'name': settingsSrv.thermos[1].name,
                                'data': [],
                                'id': 1
                            },
                            {
                                'name': settingsSrv.thermos[2].name,
                                'data': [],
                                'id': 2
                            },
                            {
                                'name': settingsSrv.thermos[3].name,
                                'data': [],
                                'id': 3
                            },
                            {
                                'name': 'RIMs Setpoint',
                                'data': [],
                                'id': 4,
                                'visible': false
                            },
                            {
                                'name': 'RIMS Window',
                                'data': [],
                                'id': 5,
                                'type': 'column',
                                'yAxis': 1,
                                'visible': false
                            }
                ],

                'title': {
                    'text': 'Hello',
                    'style': {
                        color: '#E0E0E3',
                        textTransform: 'uppercase',
                        fontSize: '20px'
                    }
                },
                'credits': {
                    'enabled': true
                },
                'loading': false,
                'size': {
                    'width': '',
                    'height': '400'
                },
                'subtitle': {
                    'text': 'this is a subtitle',
                    'style': {
                        color: '#E0E0E3',
                        textTransform: 'uppercase'
                    }
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
                var minY = Infinity;
                var maxY = -Infinity;
                if (data.length > 0) {
                    data.forEach(function (element, index, array) {
                        var dt = Date.UTC(element.year, element.month - 1, element.day, element.hour, element.minute, element.second, 0);
                        dataPts0.push([dt, element.temp0]);
                        dataPts1.push([dt, element.temp1]);
                        dataPts2.push([dt, element.temp2]);
                        dataPts3.push([dt, element.temp3]);
                        dataPts4.push([dt, element.rimsSetPoint]);
                        dataPts5.push([dt, element.rimsOnWindow]);
                        minY = arrayMin([element.temp0, element.temp1, element.temp2, element.temp3, minY]);
                        maxY = arrayMax([element.temp0, element.temp1, element.temp2, element.temp3, maxY]);


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

                myCurrentChart.yAxis[0].min = minY - ((maxY - minY) * 0.05);

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

        function arrayMin(arr) {
            var len = arr.length, min = Infinity;
            while (len--) {
                if (arr[len] < min) {
                    min = arr[len];
                }
            }
            return min;
        };

        function arrayMax(arr) {
            var len = arr.length, max = -Infinity;
            while (len--) {
                if (arr[len] > max) {
                    max = arr[len];
                }
            }
            return max;
        };
    }
})();