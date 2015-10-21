(function () {
    angular.module('app')
      .factory('chartSrv', chartSrv);

    /* @ngInject */
    function chartSrv($http, $interval, $q, settingsSrv, socket, logger) {
        var myCurrentChart = {};
        var chartConfig = {};
        var autoUpdatesEnabled = false;
        var chartTitle = 'Temperature';


        autoUpdates();
        socket.on('chartData', function (data) {
            if (autoUpdatesEnabled) {
                updateChart(data);
            }
        });
        activate();

        return {
            getChartConfig: getChartConfig,
            getChartData: getChartData,
            getCurrentData: getCurrentData,
            getCurrentChart: getCurrentChart,
            getCurrentSession: getCurrentSession,
            getEtaToAlarm: getEtaToAlarm,
            getSessions: getSessions,
            getTempSpeed: getTempSpeed,
            setAutoUpdates: setAutoUpdates
        };



        function autoUpdates() {
            myCurrentChart = getChartConfig();
            getChartData();
            //$interval(function () {
            //    if (autoUpdatesEnabled === true) {
            //        getChartData();
            //    }
            //}, 30000);
        }

        function activate() {
            myCurrentChart = getChartConfig();
        }


        function getChartConfig() {

            chartConfig = {
                'options': {
                    'chart': {
                        'type': 'areaspline',
                        'zoomType': 'x',
                        'backgroundColor': {
                            'linearGradient': { x1: 0, y1: 0, x2: 1, y2: 1 },
                            'stops': [
                               [0, '#2a2a2b'],
                               [1, '#3e3e40']
                            ]
                        },
                    },
                    'plotOptions': {
                        'areaspline': {
                            //'fillColor': {
                            //    'linearGradient': { x1: 0, y1: 0, x2: 0, y2: 1},
                            //    'stops': [
                            //        [0, Highcharts.getOptions().colors[0]],
                            //        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            //    ]
                            //},
                            'marker': {
                                'radius': 12
                            },
                            'lineWidth': 2,
                            'states': {
                                'hover': {
                                    'lineWidth': 2
                                }
                            },
                            'threshold': null
                        },
                        'spline': {
                            'marker': {
                                'radius': 12
                            },
                            'lineWidth': 2,
                            'states': {
                                'hover': {
                                    'lineWidth': 2
                                }
                            },
                            'threshold': null
                        },
                        'series': {
                            'stacking': '',
                            'dataLabels': {
                                'color': '#B0B0B3'
                            },


                            'marker': {
                                'radius': 2
                                //lineColor: '#333'
                            }
                        },
                        boxplot: {
                            fillColor: '#505053'
                        },
                        candlestick: {
                            lineColor: 'white'
                        },
                        errorbar: {
                            color: 'white'
                        }

                    },
                    plotBorderColor: '#606063',
                    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                                '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
                    labels: {
                        style: {
                            color: '#707073'
                        }
                    },

                    drilldown: {
                        activeAxisLabelStyle: {
                            color: '#F0F0F3'
                        },
                        activeDataLabelStyle: {
                            color: '#F0F0F3'
                        }
                    },

                    navigation: {
                        buttonOptions: {
                            symbolStroke: '#DDDDDD',
                            theme: {
                                fill: '#505053'
                            }
                        }
                    },
                    legend: {
                        itemStyle: {
                            color: '#E0E0E3'
                        },
                        itemHoverStyle: {
                            color: '#FFF'
                        },
                        itemHiddenStyle: {
                            color: '#606063'
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
                                'visible': true
                            },
                            {
                                'name': 'RIMS Window',
                                'data': [],
                                'id': 5,
                                'type': 'column',
                                'yAxis': 1,
                                'visible': true
                            }
                ],

                'title': {
                    'text': 'Tempuratures',
                    'style': {
                        color: '#E0E0E3',
                        textTransform: 'uppercase',
                        fontSize: '20px'
                    }
                },

                'credits': {
                    'enabled': true,
                    style: {
                        color: '#666'
                    }
                },

                'loading': false,
                'size': {
                    'width': '',
                    'height': '400'
                },
                'subtitle': {
                    'text': 'Pinch or Drag Mouse to Zoom',
                    'style': {
                        color: '#E0E0E3',
                        textTransform: 'uppercase'
                    }
                }
            };

            return chartConfig;
        }

        //function getChartData(numEntries, session) {
        //    socket.emit('getChartData', [numEntries, session]);
        //}


        function getChartData(numEntries, session) {
            var statusUrl = '/getChartData';
            var deferred = new $q.defer();

            var myEntryNum = numEntries || 300;



            statusUrl = statusUrl + '/' + myEntryNum;

            if (session) {
                statusUrl = statusUrl + '/' + session;
            }


            $http.get(statusUrl).success(function (data) {
                updateChart(data);
                deferred.resolve(data);
            });

            return deferred.promise;

        }


        function getCurrentData(series) {
            var i = (isNaN(series)) ? 0 : series;

            return myCurrentChart.series[i].data;
        }
        function getCurrentChart() {
            return myCurrentChart;
        }

        function getEtaToAlarm(whichThermo, highAlarm, lowAlarm) {
            var speed = getTempSpeed(whichThermo);
            var whichT = Number(whichThermo);
            // currently assuming highAlarm

            if (myCurrentChart.series[0].data.length >= 2) {
                var lastRow = myCurrentChart.series[whichT].data[myCurrentChart.series[whichT].data.length - 1];
                var lastTemp = lastRow[1];

                var tempDiff = Number(highAlarm) - lastTemp;

                return tempDiff / speed;
            }
            else {
                return 0;
            }
        }


        function getSessions() {
            var statusUrl = '/getSessions';
            var deferred = new $q.defer();

            $http.get(statusUrl).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        function getCurrentSession() {
            var deferred = new $q.defer();
            getSessions()
                .then(function (data) {
                    var lastOne = data[0];
                    deferred.resolve(lastOne);
                });

            return deferred.promise;
        }

        function getTempSpeed(whichThermo) {
            if (myCurrentChart.series[0].data.length >= 2) {
                var whichT = Number(whichThermo);
                var lastRow = myCurrentChart.series[whichT].data[myCurrentChart.series[whichT].data.length - 1];
                var secondLastRow = myCurrentChart.series[whichT].data[myCurrentChart.series[whichT].data.length - 2];
                var tempDiff = lastRow[1] - secondLastRow[1];
                var timeDiff = (new Date(lastRow[0]) - new Date(secondLastRow[0])) / 60000;
                return Number(tempDiff) / Number(timeDiff);
            }
            else {
                return 0;
            }
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
            autoUpdatesEnabled = enableUpdates;
        }

        function arrayMin(arr) {
            var len = arr.length, min = Infinity;
            while (len--) {
                if (arr[len] < min) {
                    min = arr[len];
                }
            }
            return min;
        }

        function arrayMax(arr) {
            var len = arr.length, max = -Infinity;
            while (len--) {
                if (arr[len] > max) {
                    max = arr[len];
                }
            }
            return max;
        }

        function updateChart(data) {

            var dataPts0 = [];
            var dataPts1 = [];
            var dataPts2 = [];
            var dataPts3 = [];
            var dataPts4 = [];
            var dataPts5 = [];
            var minY = Infinity;
            var maxY = -Infinity;
            if (Array.isArray(data) === false) {
                data = JSON.parse(data);
            }
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


            myCurrentChart.title.text = chartTitle;


        }
    }
})();