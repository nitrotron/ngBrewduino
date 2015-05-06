(function () {
    angular.module('app')
      .factory('chartSrv', chartSrv);

    /* @ngInject */
    function chartSrv($http, $interval, $q, settingsSrv) {
        var myCurrentChart = {};
        var autoUpdatesEnabled = false;
        var chartTitle = 'Temperature';

        autoUpdates();

        return {
            getChartConfig: getChartConfig,
            getChartData: getChartData,
            getCurrentData: getCurrentData,
            getCurrentChart: getCurrentChart,
            getEtaToAlarm: getEtaToAlarm,
            getTempSpeed: getTempSpeed,
            setAutoUpdates: setAutoUpdates
        };


        function autoUpdates() {
            myCurrentChart = getChartConfig();
            myCurrentChart.data.rows = getChartData();
            $interval(function () {
                if (autoUpdatesEnabled === true) {
                    getChartData();
                }
            }, 60000);
        }

        function getChartConfig() {
            var chartConfig = {};
            chartConfig.type = 'AreaChart';
            chartConfig.cssStyle = 'height:400px; width:100%; float:left;';
            chartConfig.data = {
                'cols': [],
                'rows': []
            };


            chartConfig.data.cols.push({
                'id': 'Time',
                'label': 'Time',
                'type': 'datetime',
                'p': {}
            });
            chartConfig.data.cols.push({
                'id': 't0',
                'label': settingsSrv.thermos[0].name,
                'type': 'number',
                'p': {}
            });
            chartConfig.data.cols.push({
                'id': 't1',
                'label': settingsSrv.thermos[1].name,
                'type': 'number',
                'p': {}
            });
            chartConfig.data.cols.push({
                'id': 't2',
                'label': settingsSrv.thermos[2].name,
                'type': 'number',
                'p': {}
            });
            chartConfig.data.cols.push({
                'id': 't3',
                'label': settingsSrv.thermos[3].name,
                'type': 'number'
            });


            chartConfig.options = {
                'title': chartTitle,
                'titleTextStyle': { 'color': '#D3D3D4' },
                'isStacked': 'false',
                'fill': 20,
                'curveType': 'function',
                //'trendlines': {
                //    '0': {
                //        'type': 'linear',
                //        'color': '#67DC2D',
                //        'lineWidth': 3,
                //        'opacity': 0.3,
                //        'showR2': true,
                //        'visibleInLegend': 'false'
                //    },
                //    '1': {
                //        'type': 'linear',
                //        'color': '#19fcfc',
                //        'lineWidth': '3',
                //        'opacity': '0.3',
                //        'showR2': 'true',
                //        'visibleInLegend': 'false'
                //    },
                //    '2': {
                //        'type': 'linear',
                //        'color': '#FC1919',
                //        'lineWidth': '3',
                //        'opacity': '0.3',
                //        'showR2': 'true',
                //        'visibleInLegend': 'false'
                //    },
                //    '3': {
                //        'type': 'linear',
                //        'color': '#FC8B19',
                //        'lineWidth': '3',
                //        'opacity': '0.3',
                //        'showR2': 'true',
                //        'visibleInLegend': 'false'
                //    }
                //},
                'displayExactValues': true,
                'vAxis': {
                    //'title': 'Temperature unit',
                    'gridlines': { 'count': 6, 'color': '#D3D3D4' },
                    'titleTextStyle': { 'color': '#D3D3D4' },
                    'textStyle': { 'color': '#D3D3D4' },
                    '0': { 'title': 'Temps F' },
                    '1': { 'title': 'rims' },
                },
                'hAxis': {
                    'title': 'Date',
                    'gridlines': { 'color': '#D3D3D4' },
                    'titleTextStyle': { 'color': '#D3D3D4' },
                    'textStyle': { 'color': '#D3D3D4' }
                },
                'series': {
                    '0': { 'axis': 'Temps', 'targetAxisIndex': 0 },
                    '1': { 'axis': 'rims', 'targetAxisIndex': 0 },
                    '2': { 'axis': 'rims', 'targetAxisIndex': 0 },
                    '3': { 'axis': 'rims', 'targetAxisIndex': 1 }
                },
                'axis': {
                    y: {
                        'Temps': { 'label': 'Temps F' },
                        'rims': { 'label': 'rims' }
                    }
                },
                'legend': { 'textStyle': { 'color': '#D3D3D4' } },

                'backgroundColor': '#353E42',
                'colors': ['#67DC2D', '#19fcfc', '#FC1919', '#FC8B19']
            };

            chartConfig.formatters = {};

            return chartConfig;
        }

        function getChartData() {
            var statusUrl = '/getChartData';

            var deferred = new $q.defer();


            $http.get(statusUrl).success(function (data) {
                var rows = [];
                if (data.length > 0) {
                    data.forEach(function (element, index, array) {
                        var dt = new Date(element.year, element.month, element.day, element.hour, element.minute, element.second, 0);

                        rows.push(constRowObj(dt, element.temp0,
                            element.temp1, element.temp2, element.temp3));
                    });

                    chartTitle = data[0]['sessionName'];
                }
                myCurrentChart.data.rows = rows;

                //data = rows;
                deferred.resolve(data);
            });

            return deferred.promise;

        }

        function getCurrentData() {
            return myCurrentChart.data.rows;
        }
        function getCurrentChart() {
            return myCurrentChart;
        }

        function getEtaToAlarm(whichThermo, highAlarm, lowAlarm) {
            var speed = getTempSpeed(whichThermo);
            var whichT = Number(whichThermo);
            // currently assuming highAlarm

            if (myCurrentChart.data.rows.length >= 2) {
                var lastRow = myCurrentChart.data.rows[myCurrentChart.data.rows.length - 1];
                var lastTemp = lastRow.c[whichT + 1].v;

                var tempDiff = Number(highAlarm) - lastTemp;

                return tempDiff / speed;
            }
            else {
                return 0;
            }
        }
        function getTempSpeed(whichThermo) {
            if (myCurrentChart.data.rows.length >= 2) {
                var whichT = Number(whichThermo);
                var lastRow = myCurrentChart.data.rows[myCurrentChart.data.rows.length - 1];
                var secondLastRow = myCurrentChart.data.rows[myCurrentChart.data.rows.length - 2];
                var tempDiff = lastRow.c[whichT + 1].v - secondLastRow.c[whichT + 1].v;
                var timeDiff = (new Date(lastRow.c[0].v) - new Date(secondLastRow.c[0].v)) / 60000;
                return Number(tempDiff) / Number(timeDiff);
            }
            else {
                return 0;
            }
        }

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
        function setAutoUpdates(enableUpdates) {
            autoUpdatesEnabled = enableUpdates;
        }
    }
})();