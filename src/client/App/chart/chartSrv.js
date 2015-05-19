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
                'theme': {
                    colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                       "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                    chart: {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                            stops: [
                               [0, '#2a2a2b'],
                               [1, '#3e3e40']
                            ]
                        },
                        style: {
                            fontFamily: "'Unica One', sans-serif"
                        },
                        plotBorderColor: '#606063'
                    },
                    title: {
                        style: {
                            color: '#E0E0E3',
                            textTransform: 'uppercase',
                            fontSize: '20px'
                        }
                    },
                    subtitle: {
                        style: {
                            color: '#E0E0E3',
                            textTransform: 'uppercase'
                        }
                    },
                    xAxis: {
                        gridLineColor: '#707073',
                        labels: {
                            style: {
                                color: '#E0E0E3'
                            }
                        },
                        lineColor: '#707073',
                        minorGridLineColor: '#505053',
                        tickColor: '#707073',
                        title: {
                            style: {
                                color: '#A0A0A3'

                            }
                        }
                    },
                    yAxis: {
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
                            style: {
                                color: '#A0A0A3'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        style: {
                            color: '#F0F0F0'
                        }
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                color: '#B0B0B3'
                            },
                            marker: {
                                lineColor: '#333'
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
                    },
                    credits: {
                        style: {
                            color: '#666'
                        }
                    },
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

                    // scroll charts
                    rangeSelector: {
                        buttonTheme: {
                            fill: '#505053',
                            stroke: '#000000',
                            style: {
                                color: '#CCC'
                            },
                            states: {
                                hover: {
                                    fill: '#707073',
                                    stroke: '#000000',
                                    style: {
                                        color: 'white'
                                    }
                                },
                                select: {
                                    fill: '#000003',
                                    stroke: '#000000',
                                    style: {
                                        color: 'white'
                                    }
                                }
                            }
                        },
                        inputBoxBorderColor: '#505053',
                        inputStyle: {
                            backgroundColor: '#333',
                            color: 'silver'
                        },
                        labelStyle: {
                            color: 'silver'
                        }
                    },

                    navigator: {
                        handles: {
                            backgroundColor: '#666',
                            borderColor: '#AAA'
                        },
                        outlineColor: '#CCC',
                        maskFill: 'rgba(255,255,255,0.1)',
                        series: {
                            color: '#7798BF',
                            lineColor: '#A6C7ED'
                        },
                        xAxis: {
                            gridLineColor: '#505053'
                        }
                    },

                    scrollbar: {
                        barBackgroundColor: '#808083',
                        barBorderColor: '#808083',
                        buttonArrowColor: '#CCC',
                        buttonBackgroundColor: '#606063',
                        buttonBorderColor: '#606063',
                        rifleColor: '#FFF',
                        trackBackgroundColor: '#404043',
                        trackBorderColor: '#404043'
                    },

                    // special colors for some of the
                    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
                    background2: '#505053',
                    dataLabelsColor: '#B0B0B3',
                    textColor: '#C0C0C0',
                    contrastTextColor: '#F0F0F3',
                    maskColor: 'rgba(255,255,255,0.3)'
                }, //end of theme
                'options': {
                    'chart': {
                        'type': 'spline',
                        'zoomType': 'x'
                    },
                    'plotOptions': {
                        'series': {
                            'stacking': '',
                            'marker': {
                                'radius': 2
                            }
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
                        text: 'Time'
                    },
                    minRange: 60000 * 3 // 3 minutes

                },
                'yAxis': [{
                    title: {
                        text: 'Temperatures'
                    },
                    min: 64

                },
                {
                    title: {
                        text: 'RIMs Window'
                    },
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