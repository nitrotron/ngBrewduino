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

            angular.forEach(function(value,key, obj) {
                var timer = Date.parse(value.timer) ;
                if (timer !==NaN || timer < Date.now()) {
                    obj.pull(timer)
                }
            }
            
        }

        function getTimers() {
            return timerAry;
        }
    }
})();