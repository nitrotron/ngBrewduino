/**
 * Created by jessica on 1/20/2015.
 */
(function () {
    angular.module('app')
        .controller('countDownTimer', countDownTimer);


    function countDownTimer($scope) {
        var vm = this;
        vm.timers = [];
        vm.showAddTimerPanel = false;
        vm.addTimer = addTimer;
        vm.startNewTimer = startNewTimer;
        vm.cancelNewTimer = cancelNewTimer;
        vm.timerExpired = timerExpired;
        vm.removeExpiredTimers = removeExpiredTimers;
        var timerIndex = 0;

        function addTimer() {
            vm.showAddTimerPanel = true;
        }


        function startNewTimer(newTimer, newTimerLabel) {
            vm.showAddTimerPanel = false;
            var myObj = {id: timerIndex, timer: (newTimer * 60), label: newTimerLabel, isActive: true};
            timerIndex++;
            vm.timers.push(myObj);
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
    }
})();