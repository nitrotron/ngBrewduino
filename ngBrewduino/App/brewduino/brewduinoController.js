/**
 * Created by jessica on 12/31/2014.
 */
(function () {
    angular.module('app')
        .controller('brewduinoCtrl', brewduinoCtrl);

    function brewduinoCtrl($interval, stubData, brewduionoDataSrv) {
        var vm = this;
        vm.stubData = stubData;

        vm.alarmClick = alarmClick;

        activate();

        function activate() {
            getStatus();
        }

        function alarmClick(alarm) {
            console.log('You just clicked alarm = ' + alarm);
        }

        function getStatus() {
            brewduionoDataSrv.getStatus(stubData);
        }
    }

})();