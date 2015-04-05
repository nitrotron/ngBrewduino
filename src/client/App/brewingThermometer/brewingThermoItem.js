/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('brewingThermoItem', brewingThermoItem);

    function brewingThermoItem($state, brewduinoCmdsSrv, stubData, chartData, logger, settingsSrv) {
        var vm = this;

        vm.addTimer = addTimer;
        vm.mcData = {};

        vm.alarmBtn = false;
        vm.mcData.auxBtn = stubData.auxOn;
        vm.auxClick = auxClick;
        vm.chartData = chartData;
        vm.chartTypeArea = true;
        vm.chartTypeLine = false;
        vm.changeChartType = changeChartType;
        vm.chBxChartChanged = chBxChartChanged;
        vm.closeMenu = closeMenu;
        vm.openMenu = openMenu;
        vm.mcData.pumpBtn = stubData.pumpOn;
        vm.pumpClick = pumpClick;
        vm.mcData.rimsBtn = stubData.rimsEnable;
        vm.rimsClick = rimsClick;
        vm.setAlarm = setAlarm;
        vm.settingsClick = settingsClick;
        vm.showMenu = false;
        vm.showStatusLog = settingsSrv.showStatusLog;

        //vm.getOtherThermos = getOtherThermos; 
        vm.otherThermos = [];
        vm.switchTemps = switchTemps;
        vm.thermometersList = [stubData.thermometers[$state.params.id]];
        vm.thermo = stubData.thermometers[$state.params.id];




        activate();

        function activate() {

            getStatus();

            
            vm.mcData.auxBtn = stubData.auxOn;
            vm.mcData.pumpBtn = stubData.pumpOn;
            vm.mcData.rimsBtn = stubData.rimsEnable;
            vm.otherThermos = getOtherThermos();
            stubData.thermometers.forEach(function (element, index, array) {
                if (index === Number($state.params.id)) {
                    element.chartEnabled = true;
                } else {
                    element.chartEnabled = false;
                }
            });
            vm.chartData.view = { columns: getChartColumns() };


            logger.info('Activated ' + vm.thermo.name + ' Dashboard');
        }

        function addTimer() {
            var stateParams = { id: $state.params.id };
            $state.go('cdtAdd', stateParams);
        }

        function auxClick() {
            vm.mcData.auxBtn = !vm.mcData.auxBtn;
            stubData.auxOn = vm.mcData.auxBtn;
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

        function getStatus() {
            brewduinoCmdsSrv.getStatus(vm.stubData)
            .then(function (response) {
                vm.stubData = response.data;
                logger.info('Resolved Data', vm.stubData);
            });
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

        function pumpClick() {
            vm.mcData.pumpBtn = !vm.mcData.pumpBtn;
            stubData.pumpOn = vm.mcData.pumpBtn;
        }

        function rimsClick() {
            vm.mcData.rimsBtn = !vm.mcData.rimsBtn;
            stubData.rimsEnable = vm.mcData.rimsBtn;
        }

        function setAlarm() {
            vm.alarmBtn = !vm.alarmBtn;
        }

        function settingsClick() {
            var stateParams = { id: $state.params.id };
            $state.go('settings', stateParams);
        }

        function switchTemps(thermometer) {
            var stateParams = { id: thermometer.id };
            $state.go('dashboard', stateParams);
        }

    }
})();