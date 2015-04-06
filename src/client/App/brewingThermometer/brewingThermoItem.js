/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('brewingThermoItem', brewingThermoItem);

    function brewingThermoItem($state, brewduinoCmdsSrv, brewduionoDataSrv, chartData, logger, settingsSrv) {
        var vm = this;

        vm.addTimer = addTimer;
        vm.mcData = {};

        vm.alarmBtn = false;
        vm.auxClick = auxClick;
        vm.chartData = chartData;
        vm.chartTypeArea = true;
        vm.chartTypeLine = false;
        vm.changeChartType = changeChartType;
        vm.chBxChartChanged = chBxChartChanged;
        vm.closeMenu = closeMenu;
        vm.openMenu = openMenu;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        vm.setAlarm = setAlarm;
        vm.settingsClick = settingsClick;
        vm.showMenu = false;
        vm.showStatusLog = settingsSrv.showStatusLog;
        vm.otherThermos = [];
        vm.switchTemps = switchTemps;

        activate();

        function activate() {
            vm.mcData = brewduionoDataSrv.currentStatus;
            getStatus()
            .then(function (response) {
                //vm.mcData.auxBtn = brewduionoDataSrv.currentStatus.auxOn;
                //vm.mcData.pumpBtn = brewduionoDataSrv.currentStatus.pumpOn;
                //vm.mcData.rimsBtn = brewduionoDataSrv.currentStatus.rimsEnable;
                vm.otherThermos = getOtherThermos();
                if (vm.mcData.hasOwnProperty('thermometers')) {
                    vm.mcData.thermometers.forEach(function (element, index, array) {
                        if (index === Number($state.params.id)) {
                            element.chartEnabled = true;
                        } else {
                            element.chartEnabled = false;
                        }
                    });
                    vm.thermometersList = [vm.mcData.thermometers[$state.params.id]];
                    vm.thermo = vm.mcData.thermometers[$state.params.id];
                }
                vm.chartData.view = { columns: getChartColumns() };

                if (vm.hasOwnProperty('thermo') && vm.thermo.hasOwnProperty('name')) {
                    logger.info('Activated ' + vm.thermo.name + ' Dashboard');
                }
                else {
                    logger.warning('Activated Dashboard... but waiting for data');
                }
            }
            );
        }

        function addTimer() {
            var stateParams = { id: $state.params.id };
            $state.go('cdtAdd', stateParams);
        }

        function auxClick() {
            vm.mcData.auxBtn = !vm.mcData.auxBtn;
            brewduinoCmdsSrv.setAuxPower(vm.mcData.auxBtn);
            brewduionoDataSrv.currentStatus.auxOn = vm.mcData.auxBtn;
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
            return brewduinoCmdsSrv.getStatus(vm.mcData)
            .then(function (response) { 
                vm.mcData = response.data;
                vm.thermo = response.data.thermometers[$state.params.id];
                //$scope.$apply();
                logger.info('Resolved Data', vm.mcData);
                return response;
            });
        }

        function openMenu() {
            vm.showMenu = true;
        }

        function getChartColumns() {
            var rc = [0];
            if (vm.mcData.hasOwnProperty('thermometers')) {
                vm.mcData.thermometers.forEach(function (element, index, array) {
                    if (element.chartEnabled) { rc.push(element.id + 1); }
                });
            }
            return rc;
        }

        function getOtherThermos() {
            var rc = [];
            if (vm.mcData.hasOwnProperty('thermometers')) {
                vm.mcData.thermometers.forEach(function (element, index, array) {
                    if (index !== Number($state.params.id)) {
                        rc.push(element);
                    }
                });
            }
            return rc;
        }

        function pumpClick() {
            vm.mcData.pumpBtn = !vm.mcData.pumpBtn;
            brewduionoDataSrv.currentStatus.pumpOn = vm.mcData.pumpBtn;
            brewduinoCmdsSrv.setPumpsPower(vm.mcData.pumpBtn);
        }

        function rimsClick() {
            vm.mcData.rimsBtn = !vm.mcData.rimsBtn;
            brewduionoDataSrv.currentStatus.rimsEnable = vm.mcData.rimsBtn;
            brewduinoCmdsSrv.setRimsPower(vm.mcData.rimsBtn);
        }

        function setAlarm() {
            vm.alarmBtn = !vm.alarmBtn;
            brewduinoCmdsSrv.resetAlarm();
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