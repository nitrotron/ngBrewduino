/**
 * Created by jessica on 12/31/2014.
 */
(function () {
    angular.module('app')
        .controller('brewduinoCtrl', brewduinoCtrl);

    function brewduinoCtrl($interval, brewduionoDataSrv, brewduinoCmdsSrv, logger, settingsSrv) {
        var vm = this;
        vm.mcData = {};

        vm.alarmClick = alarmClick;
        vm.auxClick = auxClick;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        //vm.rimsBtn = stubData.rimsEnable;
        //vm.pumpBtn = stubData.pumpOn;
        //vm.auxBtn = stubData.auxOn;

        activate();

        function activate() {
            vm.mcData = brewduionoDataSrv.currentStatus;
            getStatus();
            //vm.stubData = stubData;
            //vm.auxBtn = vm.mcData.auxOn;
            //vm.pumpBtn = vm.mcData.pumpOn;
            //vm.rimsBtn = vm.mcData.rimsEnable;
            vm.showStatusLog = settingsSrv.showStatusLog;


            //console.log('you are here');

            logger.info('Now viewing Classic theme');

        }

        function alarmClick(alarm) {
            brewduinoCmdsSrv.resetAlarm();
        }

        function auxClick(aux) {
            brewduionoDataSrv.currentStatus.auxOn = aux;
            brewduinoCmdsSrv.setAuxPower(aux);
        }

        function getStatus() {
            brewduinoCmdsSrv.getStatus(vm.stubData)
            .then(function (response) {
                vm.mcData = response.data;
                logger.info('Resolved Data', vm.stubData);
            });
        }

        function pumpClick(pump) {
            brewduionoDataSrv.currentStatus.pumpOn = pump;
            brewduinoCmdsSrv.setPumpsPower(pump);
        }
        function rimsClick(rims) {
            brewduionoDataSrv.currentStatus.rimsEnable = rims;
            brewduinoCmdsSrv.setRimsPower(rims);

        }
    }

})();