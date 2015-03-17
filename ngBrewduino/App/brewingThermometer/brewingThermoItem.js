/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('brewingThermoItem', brewingThermoItem);

    function brewingThermoItem($state, stubData, chartData) {
        var vm = this;

        vm.chartData = chartData;
        vm.chartTypeArea = true;
        vm.chartTypeLine = false;
        vm.changeChartType = changeChartType;
        vm.chBxChartChanged = chBxChartChanged;
        
        //vm.getOtherThermos = getOtherThermos; 
        vm.otherThermos = [];
        vm.switchTemps = switchTemps;
        vm.thermometersList = [stubData.thermometers[$state.params.id]];
        vm.thermo = stubData.thermometers[$state.params.id];
       



        activate();

        function activate() {
            console.log('you are here');
            vm.otherThermos = getOtherThermos();
            stubData.thermometers.forEach(function (element, index, array) {
                if (index === Number($state.params.id)) {
                    element.chartEnabled = true;
                } else {
                    element.chartEnabled = false;
                }
            });
            vm.chartData.view = { columns: [0, 1, 2, 3, 4] };
            vm.chartData.view = { columns: getChartColumns() };
        }

        function changeChartType(chartType) {
            vm.chartData.type = chartType;
        }
        function chBxChartChanged(thermo) {
            vm.chartData.view = { columns: getChartColumns() };
        }

        function getChartColumns() {
            var rc = [0];
            stubData.thermometers.forEach(function (element, index, array) {
                if (element.chartEnabled) { rc.push(element.id +1 ); }
            });
            return rc;
        }

        function getOtherThermos() {
            var rc = [];
            stubData.thermometers.forEach(function (element, index, array) {
                if (index !== Number($state.params.id)) {
                    rc.push(element);
                }
            });
            return rc;
        }

        function switchTemps(thermometer) {
            var stateParams = { id: thermometer.id };
            $state.go('temperature', stateParams);
        }

    }
})();