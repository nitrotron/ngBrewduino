/**
 * Created by jessica on 1/20/2015.
 */
(function () {
    angular.module('app')
        .controller('countDownTimer', countDownTimer);


    function countDownTimer($scope, brewduinoCmdsSrv, countDownTimersVal) {
        var vm = this;
        vm.timers = countDownTimersVal;
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
           
        }

        function addTimer() {
            vm.showAddTimerPanel = true;
        }


        function startNewTimer(newTimer, newTimerLabel) {
            vm.showAddTimerPanel = false;
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes() + newTimer);
            var myObj = { id: timerIndex, timer: alarmTime, label: newTimerLabel, isActive: true };
            timerIndex++;
            countDownTimersVal.push(myObj);
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
            return Date.now - timer;
        }
    }
})();