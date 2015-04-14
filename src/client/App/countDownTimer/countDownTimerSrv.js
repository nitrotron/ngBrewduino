/// <reference path="../../3rdParty/script/angular.js" />
(function () {
    angular.module('app')
        .factory('countDownTimerSrv', countDownTimerSrv);

    function countDownTimerSrv() {
        var timerAry = [];
        return {
            addTimer: addTimer,
            clearExpired: clearExpired,
            getTimers: getTimers
        };

       

        function addTimer(timer) {
            timerAry.push(timer);
        }

        function clearExpired() {

        }

        function getTimers() {
            return timerAry;
        }
    }
})();