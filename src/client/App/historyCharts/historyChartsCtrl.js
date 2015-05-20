(function () {
    angular.module('app')
        .controller('historyChartsCtrl', historyChartsCtrl);

    function historyChartsCtrl(chartSrv) {
        var vm = this;
        vm.chartTypes = [];
        vm.selectedChartType = {};
        vm.updateChartType = updateChartType;
        vm.updateSession = updateSession;
        vm.chartConfig = chartSrv.getCurrentChart();
        vm.sessions = {};

        activate();

        function activate() {
            vm.chartTypes = [
                 { type: 'areaspline', text: 'Area Spline' },
                 { type: 'spline', text: 'Spline' },
                 { type: 'area', text: 'Area' },
                 { type: 'line', text: 'Line' },
                 { type: 'column', text: 'Column' }
            ];

            vm.selectedChartType = vm.chartTypes[0];



            chartSrv.getChartData('all').
                then(function (data) {
                    vm.chartConfig = data;
                    vm.chartConfig = chartSrv.getCurrentChart();
                });
            chartSrv.getSessions()
                .then(function (sessions) {
                    vm.sessions = sessions;
                });
        }

        function updateChartType() {
            vm.chartConfig.options.chart.type = vm.selectedChartType.type;
        }
        function updateSession() {
            vm.chartConfig.loading = true;
            chartSrv.getChartData('all', vm.selectedSession.sessionName)
                .then(function (data) {
                    vm.chartConfig = data;
                    vm.chartConfig = chartSrv.getCurrentChart();
                    vm.chartConfig.loading = false;
                });
        }
    }
})();