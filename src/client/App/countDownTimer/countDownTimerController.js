/**
 * Created by jessica on 1/20/2015.
 */
(function () {
    angular.module('app')
        .controller('countDownTimer', countDownTimer);

    /* @ngInject */
    function countDownTimer($scope, brewduinoCmdsSrv, countDownTimerSrv) {
        var vm = this;
        var dateSnapShot = new Date();
        vm.timers = countDownTimerSrv.getTimers();
        vm.showAddTimerPanel = false;
        vm.addTimer = addTimer;
        vm.startNewTimer = startNewTimer;
        vm.cancelNewTimer = cancelNewTimer;
        vm.getTimer = getTimer;
        vm.timerExpired = timerExpired;
        vm.removeExpiredTimers = removeExpiredTimers;
        var timerIndex = 0;

        activate();

        function activate() {
            dateSnapShot = new Date();
        }

        function addTimer() {
            vm.showAddTimerPanel = true;
        }


        function startNewTimer(newTimer, newTimerLabel) {
            vm.showAddTimerPanel = false;
            var alarmTime = new Date();
            alarmTime.setSeconds(alarmTime.getSeconds() + (newTimer*60));
            var myObj = { id: timerIndex, timer: alarmTime, label: newTimerLabel, isActive: true };
            timerIndex++;
            countDownTimerSrv.addTimer(myObj);
            dateSnapShot = new Date();
            brewduinoCmdsSrv.setTimer(newTimer);
        }

        function cancelNewTimer() {
            vm.showAddTimerPanel = false;
        }


        function timerExpired(timer) {
            timer.isActive = false;
            $scope.$apply();
        }

        function removeExpiredTimers() {
            vm.timers.filter(function (timer) {
                return timer.isActive;
            });
        }

        function getTimer(timer) {
            return (timer - dateSnapShot < 0) ? 1 : (timer - dateSnapShot) / 1000;
        }
              
    }
})();