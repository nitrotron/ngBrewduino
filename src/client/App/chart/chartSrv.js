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
            }, 3000);
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
                //rows.push(constRowObj('10:30', 115, 100, 106, 200));
                //rows.push(constRowObj('10:31', 117, 110, 106, 208));
                //rows.push(constRowObj('10:32', 118, 120, 106, 210)); 
                //rows.push(constRowObj('10:33', 115, 130, 106, 205));
                //rows.push(constRowObj('10:34', 120, 145, 105, 205));
                //rows.push(constRowObj('10:35', 123, 150, 104, 204));
                //rows.push(constRowObj('10:36', 123, 155, 103, 199));
                //rows.push(constRowObj('10:37', 125, 156, 106, 201));
                //rows.push(constRowObj('10:38', 125, 158, 105, 203));
                //rows.push(constRowObj('10:39', 126, 159, 106, 206));
                //rows.push(constRowObj('10:40', 128, 160, 105, 206));
                //rows.push(constRowObj('10:41', 128, 160, 106, 208));
                data.forEach(function (element, index, array) {
                    var dt = new Date(element.date);
                    rows.push(constRowObj(new Date(element.date), element.temp0, element.temp1, element.temp2, element.temp3));
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