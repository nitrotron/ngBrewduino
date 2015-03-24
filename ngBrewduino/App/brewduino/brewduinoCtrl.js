/**
 * Created by jessica on 12/31/2014.
 */
(function () {
    angular.module('app')
        .controller('brewduinoCtrl', brewduinoCtrl);

    function brewduinoCtrl($interval, stubData, brewduionoDataSrv, brewduinoCmdsSrv, toaster, settingsSrv) {
        var vm = this;
        vm.stubData = stubData;

        vm.alarmClick = alarmClick;
        vm.auxClick = auxClick;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        //vm.rimsBtn = stubData.rimsEnable;
        //vm.pumpBtn = stubData.pumpOn;
        //vm.auxBtn = stubData.auxOn;

        activate();

        function activate() {
            vm.auxBtn = stubData.auxOn;
            vm.pumpBtn = stubData.pumpOn;
            vm.rimsBtn = stubData.rimsEnable;
            vm.showStatusLog = settingsSrv.showStatusLog;


            //console.log('you are here');
            getStatus();
            toaster.pop('success', 'title', 'You havve loaded the new template');
        }

        function alarmClick(alarm) {
            brewduinoCmdsSrv.resetAlarm();
        }

        function auxClick(aux) {
            stubData.auxOn = vm.auxBtn;
            brewduinoCmdsSrv.setAuxPower(aux);
        }

        function getStatus() {
            brewduinoCmdsSrv.getStatus(stubData);
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