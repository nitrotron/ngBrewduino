/**
 * Created by jessica on 12/31/2014.
 */
(function () {
    angular.module('app')
        .controller('brewduinoCtrl', brewduinoCtrl);

    function brewduinoCtrl($interval, stubData, brewduionoDataSrv, brewduinoCmdsSrv, logger, settingsSrv) {
        var vm = this;
        vm.stubData = {};

        vm.alarmClick = alarmClick;
        vm.auxClick = auxClick;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        //vm.rimsBtn = stubData.rimsEnable;
        //vm.pumpBtn = stubData.pumpOn;
        //vm.auxBtn = stubData.auxOn;

        activate();

        function activate() {
            getStatus();
            //vm.stubData = stubData;
            vm.auxBtn = vm.stubData.auxOn;
            vm.pumpBtn = vm.stubData.pumpOn;
            vm.rimsBtn = vm.stubData.rimsEnable;
            vm.showStatusLog = settingsSrv.showStatusLog;


            //console.log('you are here');
            
            logger.info('Now viewing Classic theme');
            
        }

        function alarmClick(alarm) {
            brewduinoCmdsSrv.resetAlarm();
        }

        function auxClick(aux) {
            stubData.auxOn = vm.auxBtn;
            brewduinoCmdsSrv.setAuxPower(aux);
        }

        function getStatus() {
            brewduinoCmdsSrv.getStatus(vm.stubData)
            .then(function (data) {
                vm.stubData = data;
                logger.info('Resolved Data', vm.stubData);
            });
        }

        function pumpClick(pump) {
            stubData.pumpOn = pump;
            brewduinoCmdsSrv.setPumpsPower(pump);
        }
        function rimsClick(rims) {
            stubData.rimsEnable = rims;
            brewduinoCmdsSrv.setRimsPower(rims);

        }
    }

})();