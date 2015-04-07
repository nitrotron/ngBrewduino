/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('brewingThermoItem', brewingThermoItem);

    function brewingThermoItem($state, $scope, brewduinoCmdsSrv, brewduionoDataSrv,
                                chartData, logger, settingsSrv) {
        var vm = this;
        var firstUpdate = false;

        vm.addTimer = addTimer;
        //vm.mcData = {};

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

        $scope.$watch(brewduionoDataSrv.getCurrentStatus,
            function (newValue, oldValue) {
                updateVM(newValue);
                logger.success('Updated status', vm.mcData);
            });



        function activate() {
            //vm.mcData = brewduionoDataSrv.getCurrentStatus();
            updateVM(brewduionoDataSrv.getCurrentStatus());
            getStatus()
            .then(function (response) {
                //every 10 seconds get a status update
                //   $interval(getStatus, 10000);
                //every 60 seconds see if there is more chart data
                //    $interval(getChartData, 60000);
            });

            brewduionoDataSrv.setAutoUpdates(true);
        }

        function addTimer() {
            var stateParams = { id: $state.params.id };
            $state.go('cdtAdd', stateParams);
        }

        function auxClick() {
            vm.auxOn = !vm.auxOn;
            brewduinoCmdsSrv.setAuxPower(vm.auxOn);
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
            logger.success('Updated chart', brewduionoDataSrv.getCurrentStatus());
        }

        function getStatus() {
            var foo;
            return brewduinoCmdsSrv.getStatus(foo)
            .then(function (response) {

                updateVM(response.data);

                logger.success('Updated status', response.data);
                return response;
            });
        }

        function openMenu() {
            vm.showMenu = true;
        }

        function getChartColumns() {
            var rc = [0];
            var currentStatus = brewduionoDataSrv.getCurrentStatus();
            if (currentStatus.hasOwnProperty('thermometers')) {
                currentStatus.thermometers.forEach(function (element, index, array) {
                    if (element.chartEnabled || index === Number($state.params.id)) { 
                        rc.push(element.id + 1); 
                    }
                });
            }
            return rc;
        }

        function getOtherThermos() {
            var rc = [];
            var currentStatus = brewduionoDataSrv.getCurrentStatus();
            if (currentStatus.hasOwnProperty('thermometers')) {
                currentStatus.thermometers.forEach(function (element, index, array) {
                    if (index !== Number($state.params.id)) {
                        rc.push(element);
                    }
                });
            }
            return rc;
        }

        function pumpClick() {
            vm.pumpOn = !vm.pumpOn;
            brewduinoCmdsSrv.setPumpsPower(vm.pumpOn);
        }

        function rimsClick() {
            vm.rimsEnable = !vm.rimsEnable;
            brewduinoCmdsSrv.setRimsPower(vm.rimsEnable);
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
            //vm.mcData = responseData;
            vm.rimsEnable = responseData.rimsEnable;
            vm.pumpOn = responseData.pumpOn;
            vm.auxOn = responseData.auxOn;

            vm.otherThermos = getOtherThermos();
            if (responseData.hasOwnProperty('thermometers')) {
                if (firstUpdate === false) {
                    responseData.thermometers.forEach(function (element, index, array) {
                        if (index === Number($state.params.id)) {
                            element.chartEnabled = true;
                        } else {
                            element.chartEnabled = false;
                        }
                    });
                    firstUpdate = true;
                    vm.chartData.view = { columns: getChartColumns() };
                }
                vm.thermometersList = [responseData.thermometers[$state.params.id]];
                vm.thermo = responseData.thermometers[$state.params.id];
            }
            


        }
    }
})();