/**
 * Created by jessica on 12/31/2014.
 */
(function () {
    angular.module('app')
        .controller('brewduinoCtrl', brewduinoCtrl);

    function brewduinoCtrl($scope, brewduionoDataSrv, brewduinoCmdsSrv, logger, settingsSrv) {
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
            vm.auxOn = (responseData.auxOn == 1) ? true : false;
            //vm.rimsEnable = responseData.rimsEnable;
            //vm.pumpOn = responseData.pumpOn;
            //vm.auxOn = responseData.auxOn;

            //vm.otherThermos = getOtherThermos();
            //if (responseData.hasOwnProperty('thermometers')) {
            //    if (firstUpdate === false) {
            //        responseData.thermometers.forEach(function (element, index, array) {
            //            if (index === Number($state.params.id)) {
            //                element.chartEnabled = true;
            //            } else {
            //                element.chartEnabled = false;
            //            }
            //        });
            //        firstUpdate = true;

            //    }
            //    vm.thermometersList = [responseData.thermometers[$state.params.id]];
            //    vm.thermo = responseData.thermometers[$state.params.id];

            //}
            vm.lastTempUpdate = new Date();


        }
    }

})();