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
            doesTimerExist: doesTimerExist,
            getTimers: getTimers
        };



        function addTimer(timer) {
            if (doesTimerExist(timer.timer) !== true) {
                timerAry.push(timer);
            }
        }


        function doesTimerExist(potentialTimer) {
            timerAry.forEach(function (element, index, array) {
                if (element.timer > (potentialTimer - 30000) && element.timer < (potentialTimer + 30000)) {
                    return true;
                }
            });
            return false;
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