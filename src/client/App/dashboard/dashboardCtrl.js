/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('dashboardCtrl', dashboardCtrl);

    /* @ngInject */
    function dashboardCtrl($state, $scope, brewduinoCmdsSrv, brewduionoDataSrv,
                                 logger, settingsSrv, chartSrv, countDownTimerSrv) {
        var vm = this;
        //var chartSrv = chartGoogleSrv;
        var firstUpdate = false;
        var firstChartUpdate = false;
        var dataChecks = false;

        vm.addTimer = addTimer;
        vm.alarm = {};

        vm.alarmBtn = false;
        vm.auxClick = auxClick;

        vm.chartTypeArea = true;
        vm.chartTypeLine = false;
        vm.chart = chartSrv.getCurrentChart();

        vm.changeChartType = changeChartType;
        vm.chBxChartChanged = chBxChartChanged;
        vm.clickAlarm = clickAlarm;
        vm.closeMenu = closeMenu;
        vm.dbSettingsClick = dbSettingsClick;
        vm.exitAlarm = exitAlarm;
        vm.hasTempAlarm = hasTempAlarm;
        vm.lastChartUpdate = new Date();
        vm.lastTempUpdate = new Date();
        vm.openMenu = openMenu;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        vm.rimsSettingsClick = rimsSettingsClick;
        vm.setAlarm = setAlarm;
        vm.settingsClick = settingsClick;

        vm.showAlarmForm = { highAlarm: false, lowAlarm: false };

        vm.showMenu = false;
        vm.showStatusLog = settingsSrv.showStatusLog;
        vm.otherThermos = [];
        vm.showRims = false;
        vm.switchTemps = switchTemps;
        vm.thermometers = [];
        vm.toggleAlarm = toggleAlarm;
        vm.toggleShowRims = toggleShowRims;

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
            if (vm.hasOwnProperty('thermometers') === false || vm.thermometers === undefined) {
                getStatus();
            }
            //TM vm.chart = chartSrv.getChartConfig();
            //TM vm.chart.view = { columns: getChartColumns() };
            // getChartData();
            chartSrv.getChartData('300').
                           then(function (data) {
                              // vm.chart = data;
                               vm.chart = chartSrv.getCurrentChart();
                           });


            brewduionoDataSrv.setAutoUpdates(true);
            chartSrv.setAutoUpdates(true);
 

            $scope.$watch(brewduionoDataSrv.getCurrentStatus,
                function (newValue, oldValue) {
                    updateVM(newValue);
                    logger.success('Updated status', newValue);
                });

            $scope.$watch(chartSrv.getCurrentData,
                function (newValue, oldValue) {
                    if (vm.hasOwnProperty('chart') && vm.chart.hasOwnProperty('series')) {
                       // vm.chart.data.rows = chartSrv.getCurrentData();
                        vm.lastChartUpdate = new Date();
                        vm.tempSpeed = chartSrv.getTempSpeed($state.params.id);
                        if (vm.hasOwnProperty('thermo') && vm.thermo.hasOwnProperty('highAlarm') && vm.thermo.hasOwnProperty('lowAlarm')) {
                            vm.etaAlarm = chartSrv.getEtaToAlarm($state.params.id, vm.thermo.highAlarm, vm.thermo.lowAlarm);
                        }

                        logger.success('Updated chart', newValue);
                    }
                });

            vm.showBottomButtons = settingsSrv.showBottomButtons;
            //chartSrv.enableRims(vm.showRims);
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
       //     vm.chart.type = chartType;
        }
        function chBxChartChanged(thermo) {
         //   vm.chart.view = { columns: getChartColumns() };
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

        function hasTempAlarm(id) {
            return (vm.alarm.tempA == 1 && vm.alarm.whichTemp == id);
        }

        function getChartData() {

            //if (firstChartUpdate === false) {
            //    firstChartUpdate = true;
            //    chartSrv.getChartData()
            //    .then(function (data) {
            //        if (vm.hasOwnProperty('chart') && vm.chart.hasOwnProperty('data')) {
            //            vm.chart.data.rows = data;
            //        }
            //    });
            //}
        }

        function getStatus() {
            return brewduinoCmdsSrv.getStatus()
             .then(function (response) {
                 updateVM(response.data);

                //TM vm.chart = chartSrv.getChartConfig();
               //TM  vm.chart.view = { columns: getChartColumns() };
                 //getChartData();

                 //logger.success('Updated status', response.data);
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
                    rc.push(index + 3);
                }
            });
            if (vm.showRims) {
                rc.push(1);
                rc.push(2);
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


        function switchTemps(thermometer) {
            var stateParams = { id: thermometer.id };
            $state.go('dashboard', stateParams);
        }


        function toggleAlarm(whichAlarm) {
            vm[whichAlarm] = vm.thermo[whichAlarm];
            vm.showAlarmForm[whichAlarm] = !vm.showAlarmForm[whichAlarm];
        }

        function toggleShowRims() {
            //vm.showRims = !vm.showRims;
            ////chartSrv.enableRims(vm.showRims);
            //vm.chart.view = { columns: getChartColumns() };
        }

        function updateVM(responseData) {
            //vm.mcData = responseData;
            vm.statusInfo = responseData;
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

            if (responseData.timers.length > 0) {
                var timers = responseData.timers;

                var arduinoDate = new Date();
                var arduinoTime = responseData.arduinoTimeLong.split(':');
                arduinoDate.setHours(arduinoTime[0]);
                arduinoDate.setMinutes(arduinoTime[1]);
                arduinoDate.setSeconds(arduinoTime[2].split(' ')[0]);
                arduinoDate.setMilliseconds(0);

                timers.forEach(function (element, index, array) {
                    var timeLeft = new Date();
                    var elementSplit = element.split(':');
                    timeLeft.setHours(elementSplit[0]);
                    timeLeft.setMinutes(elementSplit[1]);
                    timeLeft.setSeconds(elementSplit[2]);

                    var timeLeftMs = timeLeft - arduinoDate;
                    var msec = timeLeftMs;
                    var hh = Math.floor(msec / 1000 / 60 / 60);
                    msec -= hh * 1000 * 60 * 60;
                    var mm = Math.floor(msec / 1000 / 60);
                    msec -= mm * 1000 * 60;
                    var ss = Math.floor(msec / 1000);
                    msec -= ss * 1000;


                    var potTimer = new Date();
                    potTimer.setHours(potTimer.getHours() + hh);
                    potTimer.setMinutes(potTimer.getMinutes() + mm);
                    potTimer.setSeconds(potTimer.getSeconds() + ss);

                    if (countDownTimerSrv.doesTimerExist(potTimer) !== true) {
                        var timerIndex = countDownTimerSrv.getTimers().length + 1;
                        var myObj = { id: timerIndex, timer: potTimer, label: 'From Arduino', isActive: true };
                        countDownTimerSrv.addTimer(myObj);
                    }

                });
            }

        }

    }
})();