/// <reference path="../../3rdParty/script/angular.js" />
(function () {
    angular.module('app')
        .factory('countDownTimerSrv', countDownTimerSrv);

    /* @ngInject */
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
            var time = new Date();

            for (var i = timerAry.length - 1; i >= 0; i--) {
                var timer = Date.parse(timerAry[i].timer);
                if (isNaN(timer) || timer < Date.now()) {
                    timerAry.splice(i, 1);
                }
            }
        }

        function getTimers() {
            return timerAry;
        }
    }
})();