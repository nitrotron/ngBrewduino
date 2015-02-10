/**
 * Created by jessica on 12/31/2014.
 */
(function () {
    angular.module('app')
        .controller('brewduinoCtrl', brewduinoCtrl);

    function brewduinoCtrl(stubData) {
        var vm = this;
        vm.stubData = stubData;

        vm.alarmClick = alarmClick;


        function alarmClick(alarm) {
            console.log('You just clicked alarm = ' + alarm);
        }
    }

})();