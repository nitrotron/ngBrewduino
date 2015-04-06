/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('brewingThermoItem', brewingThermoItem);

    function brewingThermoItem($state, $interval, brewduinoCmdsSrv, brewduionoDataSrv,
                                chartData, logger, settingsSrv) {
        var vm = this;
        var firstUpdate = false;

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

        //$scope.$watch(brewduionoDataSrv.getCurrentStatus,
        //    function (newValue, oldValue) {
        //        updateVM(newValue);
        //    });



        function activate() {
            vm.mcData = brewduionoDataSrv.getCurrentStatus();
            getStatus()
            .then(function (response) {
                //every 10 seconds get a status update
                $interval(getStatus, 10000);
                //every 60 seconds see if there is more chart data
                $interval(getChartData, 60000);
            });

            //brewduionoDataSrv.setAutoUpdates(true);
        }

        function addTimer() {
            var stateParams = { id: $state.params.id };
            $state.go('cdtAdd', stateParams);
        }

        function auxClick() {
            vm.mcData.auxOn = !vm.mcData.auxOn;
            brewduinoCmdsSrv.setAuxPower(vm.mcData.auxOn);
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

        function getChartData() {
            logger.success('Updated chart', vm.mcData);
        }

        function getStatus() {
            return brewduinoCmdsSrv.getStatus(vm.mcData)
            .then(function (response) {

                updateVM(response.data);

                logger.success('Updated status', vm.mcData);
                return response;
            });
        }

        function openMenu() {
            vm.showMenu = true;
        }

        function getChartColumns() {
            var rc = [0];
            if (vm.hasOwnProperty('mcData') && vm.mcData && vm.mcData.hasOwnProperty('thermometers')) {
                vm.mcData.thermometers.forEach(function (element, index, array) {
                    if (element.chartEnabled) { rc.push(element.id + 1); }
                });
            }
            return rc;
        }

        function getOtherThermos() {
            var rc = [];
            if (vm.hasOwnProperty('mcData') && vm.mcData && vm.mcData.hasOwnProperty('thermometers')) {
                vm.mcData.thermometers.forEach(function (element, index, array) {
                    if (index !== Number($state.params.id)) {
                        rc.push(element);
                    }
                });
            }
            return rc;
        }

        function pumpClick() {
            vm.mcData.pumpOn = !vm.mcData.pumpOn;
            brewduinoCmdsSrv.setPumpsPower(vm.mcData.pumpOn);
        }

        function rimsClick() {
            vm.mcData.rimsEnable = !vm.mcData.rimsEnable;
            brewduinoCmdsSrv.setRimsPower(vm.mcData.rimsEnable);
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


        function updateVM(responseData) {
            vm.mcData = responseData;

            vm.otherThermos = getOtherThermos();
            if (vm.hasOwnProperty('mcData') && vm.mcData && vm.mcData.hasOwnProperty('thermometers')) {
                if (firstUpdate === false) {
                    vm.mcData.thermometers.forEach(function (element, index, array) {
                        if (index === Number($state.params.id)) {
                            element.chartEnabled = true;
                        } else {
                            element.chartEnabled = false;
                        }
                    });
                    firstUpdate = true;
                    vm.chartData.view = { columns: getChartColumns() };
                }
                vm.thermometersList = [vm.mcData.thermometers[$state.params.id]];
                vm.thermo = vm.mcData.thermometers[$state.params.id];
            }
            


        }
    }
})();