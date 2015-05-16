(function () {
    angular.module('app')
        .controller('historyChartsCtrl', historyChartsCtrl);

    function historyChartsCtrl(chartSrv) {
        var vm = this;


        vm.chartConfig = chartSrv.getCurrentChart();

        activate();

        function activate() {
            chartSrv.getChartData().
                then(function (data) {
                    vm.chartConfig = data;
                    vm.chartConfig = chartSrv.getCurrentChart();
                });
        }
    }
})();