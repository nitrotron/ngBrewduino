/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('dashboardCtrl', dashboardCtrl);

    /* @ngInject */
    function dashboardCtrl($state, $scope, brewduinoCmdsSrv, brewduionoDataSrv,
                                 logger, settingsSrv, chartSrv, countDownTimerSrv, socket) {
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
        vm.clearAlarm = clearAlarm;
        vm.clickAlarm = clickAlarm;
        vm.closeMenu = closeMenu;
        vm.dbSettingsClick = dbSettingsClick;
        vm.exitAlarm = exitAlarm;
        vm.goToCharts = goToCharts;
        vm.hasTempAlarm = hasTempAlarm;
        vm.lastChartUpdate = new Date();
        vm.lastTempUpdate = new Date();
        vm.openMenu = openMenu;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        vm.rimsSettingsClick = rimsSettingsClick;
        vm.settingsClick = settingsClick;

        vm.showAlarmForm = { highAlarm: false, lowAlarm: false };

        vm.showMenu = false;
        vm.showStatusLog = settingsSrv.showStatusLog;
        vm.otherThermos = [];
        vm.showRims = false;
        vm.switchTemps = switchTemps;
        vm.thermometers = [];
        vm.toggleAlarm = toggleAlarm;
        //vm.toggleShowRims = toggleShowRims;

        vm.tempSpeed = 0;
        vm.etaAlarm = 0;

        vm.highAlarm = '';
        vm.lowAlarm = '';


        activate();




        function activate() {
            updateVM(brewduionoDataSrv.getCurrentStatus());
            if (vm.hasOwnProperty('thermometers') === false || vm.thermometers === undefined) {
                getStatus();
            }
            
            
            chartSrv.getChartData('300').
                           then(function (data) {
                               // vm.chart = data;
                               vm.chart = chartSrv.getCurrentChart();
                               var chart = vm.chart.getHighcharts();
                           });


            brewduionoDataSrv.setAutoUpdates(true);
            chartSrv.setAutoUpdates(true);

          
            brewduionoDataSrv.subscribe(updateVM, 'status');
            brewduionoDataSrv.subscribe(updateTimer, 'newTimer');
            $scope.$on('$destroy', function () {
                brewduionoDataSrv.unsubscribe(updateVM, 'status');
                brewduionoDataSrv.unsubscribe(updateTimer, 'newTimer');
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

        function goToCharts() {
            var stateParams = { id: $state.params.id };
            $state.go('historyCharts', stateParams);
        }

        function hasTempAlarm(id) {
            return (vm.alarm.tempA == 1 && vm.alarm.whichTemp == id);
        }

        function getChartData() {
        }

        function getStatus() {
            return brewduinoCmdsSrv.getStatus();
        }

        function openMenu() {
            vm.showMenu = true;
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

        function clearAlarm() {
            vm.alarmBtn = false;
            brewduinoCmdsSrv.resetAlarm();
            countDownTimerSrv.clearExpired();
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

        function updateTimer(newTimerObject) {
            logger.info('Got a new timer', newTimerObject);
            if (newTimerObject.hasOwnProperty('timer') && countDownTimerSrv.doesTimerExist(newTimerObject.timer) !== true) {
                var timerIndex = countDownTimerSrv.getTimers().length + 1;
                var alarmTime = new Date();
                alarmTime.setSeconds(alarmTime.getSeconds() + (newTimerObject.timer * 60));
                var myObj = { id: timerIndex, timer: alarmTime, label: newTimerObject.label, isActive: true };
                countDownTimerSrv.addTimer(myObj);
            }

            //TODO this is an antipattern, but not sure how to get around it at this time.
            if (!$scope.$$phase) {
                $scope.$apply();
            }


        }

        function updateVM(responseData) {
            //vm.mcData = responseData;
            console.log('got responsedata');
            //logger.info('Successful getStatus', responseData);
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

            //TODO this is an antipattern, but not sure how to get around it at this time.
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            
            console.log('Done responsedata');

        }

    }
})();