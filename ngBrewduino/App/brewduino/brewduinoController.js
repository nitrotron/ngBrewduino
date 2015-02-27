/**
 * Created by jessica on 12/31/2014.
 */
(function () {
    angular.module('app')
        .controller('brewduinoCtrl', brewduinoCtrl);

    function brewduinoCtrl($interval, stubData, brewduionoDataSrv, brewduinoCmdsSrv) {
        var vm = this;
        vm.stubData = stubData;

        vm.alarmClick = alarmClick;
        vm.auxClick = auxClick;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;

        activate();

        function activate() {
            getStatus();
        }

        function alarmClick(alarm) {
            console.log('You just clicked alarm = ' + alarm);
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
            brewduinoCmdsSrv.setRimsPower(rims);
        }
    }

})();