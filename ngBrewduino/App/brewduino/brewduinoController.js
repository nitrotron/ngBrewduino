/**
 * Created by jessica on 12/31/2014.
 */
(function () {
    angular.module('app')
        .controller('brewduinoCtrl', brewduinoCtrl);

    function brewduinoCtrl($interval, stubData, brewduionoDataSrv, brewduinoCmdsSrv, toaster) {
        var vm = this;
        vm.stubData = stubData;

        vm.alarmClick = alarmClick;
        vm.auxClick = auxClick;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        vm.rimsBtn = stubData.rimsEnable;
        vm.pumpBtn = stubData.pumpOn;
        vm.auxBtn = stubData.auxOn;

        activate();

        function activate() {
            vm.rimsBtn = stubData.rimsEnable;
            vm.pumpBtn = stubData.pumpOn;
            vm.auxBtn = stubData.auxOn;
            console.log("you are here");
            //getStatus();
            //toaster.pop('success', 'title', 'You havve loaded the new template');
        }

        function alarmClick(alarm) {
            brewduinoCmdsSrv.resetAlarm();
        }

        function auxClick(aux) {
            brewduinoCmdsSrv.setAuxPower(aux);
        }

        function getStatus() {
            brewduionoDataSrv.getStatus(stubData);
        }

        function pumpClick(pump) {
            brewduinoCmdsSrv.setPumpsPower(pump);
        }
        function rimsClick(rims) {
            stubData.rimsEnable = rims;
            brewduinoCmdsSrv.setRimsPower(rims);

        }
    }

})();