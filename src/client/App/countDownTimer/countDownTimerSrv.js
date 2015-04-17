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
            var time = new Date();

            angular.forEach(timerAry, function (value, key, timers) {
                var timer = Date.parse(value.timer);
                if (isNaN(timer) || timer < Date.now()) {
                    timers.splice(key, 1);
                }
            });
            
        }

        function getTimers() {
            return timerAry;
        }
    }
})();