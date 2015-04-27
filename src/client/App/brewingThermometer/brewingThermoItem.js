/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('brewingThermoItem', brewingThermoItem);

    function brewingThermoItem($state, $scope, brewduinoCmdsSrv, brewduionoDataSrv,
                                 logger, settingsSrv, chartSrv, countDownTimerSrv) {
        var vm = this;
        var firstUpdate = false;
        var firstChartUpdate = false;
        var dataChecks = false;

        vm.addTimer = addTimer;
        vm.alarm = {};
        //vm.mcData = {};

        vm.alarmBtn = false;
        vm.auxClick = auxClick;
        //vm.chartData = chartData;
        //vm.chart = {};
        vm.chartTypeArea = true;
        vm.chartTypeLine = false;
        //vm.chartView = [];
        vm.changeChartType = changeChartType;
        vm.chBxChartChanged = chBxChartChanged;
        vm.clickAlarm = clickAlarm;
        vm.closeMenu = closeMenu;
        vm.dbSettingsClick = dbSettingsClick;
        vm.exitAlarm = exitAlarm;
        vm.lastChartUpdate = new Date();
        vm.lastTempUpdate = new Date();
        vm.openMenu = openMenu;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        vm.rimsSettingsClick = rimsSettingsClick;
        vm.setAlarm = setAlarm;
        vm.settingsClick = settingsClick;
        //vm.showAlarmForm = showAlarmForm;
        vm.showAlarmForm = { highAlarm: false, lowAlarm: false };
        //vm.showAlarmForm['highAlarm'] = false;
        //vm.showAlarmForm['lowAlarm'] = false;

        vm.showMenu = false;
        vm.showStatusLog = settingsSrv.showStatusLog;
        vm.otherThermos = [];
        vm.switchTemps = switchTemps;
        vm.thermometers = [];
        vm.toggleAlarm = toggleAlarm;


        vm.tempSpeed = 0;
        vm.etaAlarm = 0;

        vm.highAlarm = '';
        vm.lowAlarm = '';


        activate();




        function activate() {
            vm.chartOtherThermos = getOtherTheromosChart();
            settingsSrv.thermos.forEach(function (element, index, array) {
                element.chartEnabled = false;
            });
            settingsSrv.thermos[Number($state.params.id)].chartEnabled = true;

            updateVM(brewduionoDataSrv.getCurrentStatus());
            getStatus();
            getChartData();

            brewduionoDataSrv.setAutoUpdates(true);
            chartSrv.setAutoUpdates(true);


            $scope.$watch(brewduionoDataSrv.getCurrentStatus,
                function (newValue, oldValue) {
                    updateVM(newValue);
                    logger.success('Updated status', newValue);
                });
            $scope.$watch(chartSrv.getCurrentData,
                function (newValue, oldValue) {
                    if (vm.hasOwnProperty('chart') && vm.chart.hasOwnProperty('data')) {
                        var foo = chartSrv.getCurrentData();
                        vm.chart.data.rows = chartSrv.getCurrentData();
                        vm.lastChartUpdate = new Date();
                        vm.tempSpeed = chartSrv.getTempSpeed($state.params.id);
                        vm.etaAlarm = chartSrv.getEtaToAlarm($state.params.id, vm.thermo.highAlarm, vm.thermo.lowAlarm);
                        logger.success('Updated chart', newValue);
                    }
                });
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
            vm.chart.type = chartType;
        }
        function chBxChartChanged(thermo) {
            vm.chart.view = { columns: getChartColumns() };
        }

        function clickAlarm(whichAlarm) {
            vm[whichAlarm] = vm.thermo[whichAlarm];
            vm.showAlarmForm[whichAlarm] = true;
        }

        function closeMenu() {
            vm.showMenu = false;
        }

        function dbSettingsClick() {
            var stateParams = { id: $state.params.id };
            $state.go('dbSettings', stateParams);
        }

        function exitAlarm(whichAlarm, id, alarmValue) {
            vm.showAlarmForm[whichAlarm] = false;
            vm.thermo[whichAlarm] = alarmValue;
            if (whichAlarm === 'highAlarm') {
                brewduinoCmdsSrv.setHighAlarms(id, alarmValue);
            }
            else {
                brewduinoCmdsSrv.setLowAlarms(id, alarmValue);
            }
        }

        function getChartData() {
            if (firstChartUpdate === false) {
                firstChartUpdate = true;
                chartSrv.getChartData()
                .then(function (data) {
                    if (vm.hasOwnProperty('chart') && vm.chart.hasOwnProperty('data')) {
                        vm.chart.data.rows = data;
                    }
                });
            }
        }

        function getStatus() {
            return brewduinoCmdsSrv.getStatus()
             .then(function (response) {

                 updateVM(response.data);

                 vm.chart = chartSrv.getChartConfig();
                 vm.chart.view = { columns: getChartColumns() };
                 getChartData();


                 logger.success('Updated status', response.data);
                 return response;
             }, function (reason) {
                 logger.error('Unsuccessful with getting status', reason);
             });
        }

        function openMenu() {
            vm.showMenu = true;
        }

        function getChartColumns() {
            var rc = [0];
            settingsSrv.thermos.forEach(function (element, index, array) {
                if (element.chartEnabled || index === Number($state.params.id)) {
                    rc.push(index + 1);
                }
            });
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

        function getOtherTheromosChart() {
            var rc = [];
            settingsSrv.thermos.forEach(function (element, index, array) {
                if (index !== Number($state.params.id)) {
                    rc.push(element);
                }
            });

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

        function rimsSettingsClick() {
            var stateParams = { id: $state.params.id };
            $state.go('rimsSettings', stateParams);
        }

        function setAlarm() {
            vm.alarmBtn = false;
            brewduinoCmdsSrv.resetAlarm();
            if (vm.alarm.tempA == 1) {
                var thermo = vm.thermometers[vm.alarm.whichTemp];
                if (thermo.highAlarm < thermo.temp) {
                    brewduinoCmdsSrv.setHighAlarms(vm.alarm.whichTemp, 255);
                }
                else {
                    brewduinoCmdsSrv.setLowAlarms(vm.alarm.whichTemp, 32);
                }
            }
            else {
                countDownTimerSrv.clearExpired();
            }
        }

        function settingsClick() {
            var stateParams = { id: $state.params.id };
            $state.go('settings', stateParams);
        }

        //function showAlarmForm(whichAlarm) {
        //    var you = 'arehere';
        //    return (vm.showAlarmFormState[whichAlarm] === true) ;
        //}

        function switchTemps(thermometer) {
            var stateParams = { id: thermometer.id };
            $state.go('dashboard', stateParams);
        }


        function toggleAlarm(whichAlarm) {
            vm[whichAlarm] = vm.thermo[whichAlarm];
            vm.showAlarmForm[whichAlarm] = !vm.showAlarmForm[whichAlarm];
        }

        function updateVM(responseData) {
            //vm.mcData = responseData;
            vm.rimsEnable = responseData.rimsEnable;
            vm.pumpOn = responseData.pumpOn;
            vm.auxOn = responseData.auxOn;

            vm.thermometers = responseData.thermometers;
            vm.otherThermos = getOtherThermos();


            if (dataChecks === false) {
                if (responseData.hasOwnProperty('thermometers') &&
                    responseData.hasOwnProperty('tempAlarmActive') &&
                    responseData.hasOwnProperty('timerAlarmActive') &&
                    responseData.hasOwnProperty('whichThermoAlarm')) {
                    dataChecks = true;
                }
                else {
                    return; // no need to go further
                }

            }


            if (firstUpdate === false) {
                responseData.thermometers.forEach(function (element, index, array) {
                    if (index === Number($state.params.id)) {
                        element.chartEnabled = true;
                    } else {
                        element.chartEnabled = false;
                    }
                });
                firstUpdate = true;

            }
            vm.thermometersList = [responseData.thermometers[$state.params.id]];
            vm.thermo = responseData.thermometers[$state.params.id];


            vm.lastTempUpdate = new Date();

            if (responseData.tempAlarmActive === 1 || responseData.timerAlarmActive === 1) {
                vm.alarmBtn = true;
            }

            vm.alarm = {
                tempA: responseData.tempAlarmActive,
                timeA: responseData.timerAlarmActive,
                whichTemp: responseData.whichThermoAlarm
            };

        }


    }
})();