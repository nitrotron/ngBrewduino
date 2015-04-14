/**
 * Created by jessica on 12/31/2014.
 */
(function () {
    angular.module('app')
        .controller('brewduinoCtrl', brewduinoCtrl);

    function brewduinoCtrl($scope, brewduionoDataSrv, brewduinoCmdsSrv, logger, settingsSrv, countDownTimerSrv) {
        var vm = this;
        vm.mcData = {};

        vm.alarmClick = alarmClick;
        vm.auxClick = auxClick;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        
        activate();

        function activate() {
            vm.mcData = brewduionoDataSrv.currentStatus;
            getStatus()
            .then(function (response) {
                vm.showStatusLog = settingsSrv.showStatusLog;

                logger.info('Now viewing Classic theme');
            });
            brewduionoDataSrv.setAutoUpdates(true);
            $scope.$watch(brewduionoDataSrv.getCurrentStatus,
               function (newValue, oldValue) {
                   updateVM(newValue);
                   logger.success('Updated status', newValue);
               });
        }

        function alarmClick(alarm) {
            brewduinoCmdsSrv.resetAlarm();
            if (vm.alarm.tempA === 1) {
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

        function auxClick(aux) {

            //brewduionoDataSrv.currentStatus.auxOn = aux;
            brewduinoCmdsSrv.setAuxPower(aux);
        }

        function getStatus() {
            return brewduinoCmdsSrv.getStatus(vm.mcData)
             .then(function (response) {
                 vm.mcData = response.data;
                 logger.info('Resolved Data', vm.mcData);
                 return response;
             });

        }

        function pumpClick(pump) {
            //brewduionoDataSrv.currentStatus.pumpOn = pump;
            //vm.mcData.pumpOn = pump;
            brewduinoCmdsSrv.setPumpsPower(pump);
            
        }
        function rimsClick(rims) {
            //brewduionoDataSrv.currentStatus.rimsEnable = rims;
            brewduinoCmdsSrv.setRimsPower(rims);

        }


        function updateVM(responseData) {
            vm.mcData = responseData;
            vm.alarmBtn = (responseData.tempAlarmActive === 1|| responseData.timerAlarmActive === 1 ) ? true : false;
            vm.mcData.auxOn = (responseData.auxOn === 1) ? true : false;
            vm.mcData.rimsEnable = (responseData.rimsEnable === 1) ? true : false;
            vm.mcData.pumpOn = (responseData.pumpOn === 1) ? true : false;
            vm.lastTempUpdate = new Date();

            vm.alarm = {
                tempA: responseData.tempAlarmActive,
                timeA: responseData.timerAlarmActive,
                whichTemp: responseData.whichThermoAlarm
            };
        }
    }

})();