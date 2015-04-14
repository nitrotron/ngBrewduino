(function () {
    angular.module('app')
      .factory('chartSrv', chartSrv);

    function chartSrv($http, $interval, $q, settingsSrv) {
        var myCurrentChart = {};
        var autoUpdatesEnabled = false;

        autoUpdates();

        return {
            getChartConfig: getChartConfig,
            getChartData: getChartData,
            getCurrentData: getCurrentData,
            getCurrentChart: getCurrentChart,
            setAutoUpdates: setAutoUpdates
        };


        function autoUpdates() {
            myCurrentChart = getChartConfig();
            myCurrentChart.data.rows = getChartData();
            $interval(function () {
                if (autoUpdatesEnabled === true) {
                    getChartData();
                }
            }, 3000000);
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
                'label': settingsSrv.thermoNames[0],
                'type': 'number',
                'p': {}
            });
            chartConfig.data.cols.push({
                'id': 't1',
                'label': settingsSrv.thermoNames[1],
                'type': 'number',
                'p': {}
            });
            chartConfig.data.cols.push({
                'id': 't2',
                'label': settingsSrv.thermoNames[2],
                'type': 'number',
                'p': {}
            });
            chartConfig.data.cols.push({
                'id': 't3',
                'label': settingsSrv.thermoNames[3],
                'type': 'number'
            });


            chartConfig.options = {
                'title': 'Temperatures',
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
                    'title': 'Temperature unit', 'gridlines': { 'count': 6, 'color': '#D3D3D4' },
                    'titleTextStyle': { 'color': '#D3D3D4' },
                    'textStyle': { 'color': '#D3D3D4' }
                },
                'hAxis': {
                    'title': 'Date',
                    'gridlines': { 'color': '#D3D3D4' },
                    'titleTextStyle': { 'color': '#D3D3D4' },
                    'textStyle': { 'color': '#D3D3D4' }
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
              
                data.forEach(function (element, index, array) {
                    var dt = new Date(element.year, element.month, element.day, element.hour, element.minute, element.second, 0);
              
                    rows.push(constRowObj(dt, element.temp0,
                        element.temp1, element.temp2, element.temp3));
                });
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