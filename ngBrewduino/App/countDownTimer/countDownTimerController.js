/**
 * Created by jessica on 1/20/2015.
 */
(function () {
    angular.module('app')
        .controller('countDownTimer', countDownTimer);


    function countDownTimer($scope) {
        $scope.timers = [];
        $scope.showAddTimerPanel = false;
        $scope.addTimer = addTimer;
        $scope.startNewTimer = startNewTimer;
        $scope.cancelNewTimer = cancelNewTimer;
        $scope.timerExpired = timerExpired;
        $scope.removeExpiredTimers = removeExpiredTimers;
        var timerIndex = 0;

        function addTimer() {
            $scope.showAddTimerPanel = true;
        }


        function startNewTimer(newTimer, newTimerLabel) {
            $scope.showAddTimerPanel = false;
            var myObj = {id: timerIndex, timer: (newTimer * 60), label: newTimerLabel, isActive: true};
            timerIndex++;
            $scope.timers.push(myObj);
        }

        function cancelNewTimer() {
            $scope.showAddTimerPanel = false;
        }


        function timerExpired(timer) {
            timer.isActive = false;
            $scope.$apply();
        }

        function removeExpiredTimers() {
            $scope.timers.filter(function (timer) {
                return timer.isActive;
            });
        }
    }
})();