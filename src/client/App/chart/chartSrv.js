(function () {
    angular.module('app')
      .factory('chartSrv', chartSrv);

    function chartSrv($http, $interval, settingsSrv) {
        var myCurrentChart = {};
        var autoUpdatesEnabled = false;

        autoUpdates();

        return {
            getChartConfig: getChartConfig,
            getCurrentChart: getCurrentChart,
            setAutoUpdates: setAutoUpdates
        };


        function autoUpdates() {
            $interval(function () {
                if (autoUpdatesEnabled === true) {
                    getCurrentChart();
                }
            }, 30000);
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
                'type': 'string',
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
                    'gridlines': { 'color': '#D3D3D4' },
                    'titleTextStyle': { 'color': '#D3D3D4' },
                    'textStyle': { 'color': '#D3D3D4' }
                },
                'legend': { 'textStyle': { 'color': '#D3D3D4' } },

                'backgroundColor': '#353E42',
                'colors': ['#67DC2D', '#19fcfc', '#FC1919', '#FC8B19']
            };

            chartConfig.formatters = {};

        }

        function getCurrentChart() {
            var statusUrl = '/getChartData';
            return $http.get(statusUrl).success(function (data) {
                myCurrentChart = data;
            });
        }

        function setAutoUpdates(enableUpdates) {
            autoUpdatesEnabled = enableUpdates;
        }
    }
})();