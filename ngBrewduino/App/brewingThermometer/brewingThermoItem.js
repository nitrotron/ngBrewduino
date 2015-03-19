/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('brewingThermoItem', brewingThermoItem);

    function brewingThermoItem($state, stubData, chartData, toaster) {
        var vm = this;

        vm.rimsBtn = stubData.rimsEnable;
        vm.backToClassic = backToClassic;
        vm.chartData = chartData;
        vm.chartTypeArea = true;
        vm.chartTypeLine = false;
        vm.changeChartType = changeChartType;
        vm.chBxChartChanged = chBxChartChanged;
        vm.closeMenu = closeMenu;
        vm.openMenu = openMenu;
        vm.rimsClick = rimsClick;
        vm.showMenu = false;

        //vm.getOtherThermos = getOtherThermos; 
        vm.otherThermos = [];
        vm.switchTemps = switchTemps;
        vm.thermometersList = [stubData.thermometers[$state.params.id]];
        vm.thermo = stubData.thermometers[$state.params.id];




        activate();

        function activate() {
            vm.rimsBtn = stubData.rimsEnable;
            vm.otherThermos = getOtherThermos();
            stubData.thermometers.forEach(function (element, index, array) {
                if (index === Number($state.params.id)) {
                    element.chartEnabled = true;
                } else {
                    element.chartEnabled = false;
                }
            });
            vm.chartData.view = { columns: getChartColumns() };

            toaster.pop('success', vm.thermo.name, 'Activated ' + vm.thermo.name + ' Dashboard');
        }

        function backToClassic() {
            var stateParams = { id: 0};
            $state.go('main');
        }

        function changeChartType(chartType) {
            vm.chartData.type = chartType;
        }
        function chBxChartChanged(thermo) {
            vm.chartData.view = { columns: getChartColumns() };
        } 

        function closeMenu() {
            vm.showMenu = false;
        }

        function openMenu() {
            vm.showMenu = true;
        }




        function getChartColumns() {
            var rc = [0];
            stubData.thermometers.forEach(function (element, index, array) {
                if (element.chartEnabled) { rc.push(element.id + 1); }
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

        function rimsClick() {
            vm.rimsBtn = !vm.rimsBtn;
            stubData.rimsEnable = vm.rimsBtn;
        }

        function switchTemps(thermometer) {
            var stateParams = { id: thermometer.id };
            $state.go('temperature', stateParams);
        }

    }
})();