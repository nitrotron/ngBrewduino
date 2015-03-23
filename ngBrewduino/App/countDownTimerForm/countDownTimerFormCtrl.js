(function () {
    angular.module('app')
    .controller('countDownTimerFormCtrl', countDownTimerFormCtrl);

    function countDownTimerFormCtrl($state, brewduinoCmdsSrv, countDownTimersVal, toaster) {
        var vm = this;

        vm.addTimer = addTimer;
        vm.cancelAddTimer = cancelAddTimer;

        function addTimer(newTimer, newTimerLabel) {
            var alarmTime = new Date();
            alarmTime.setSeconds(alarmTime.getSeconds() + (newTimer * 60));
            var timerIndex = countDownTimersVal.length + 1;
            var myObj = { id: timerIndex, timer: alarmTime, label: newTimerLabel, isActive: true };
            timerIndex++;
            countDownTimersVal.push(myObj);
            //dateSnapShot = new Date();
            brewduinoCmdsSrv.setTimer(newTimer);
            
            toaster.pop('success', newTimerLabel, 'Added Timer ' + newTimer + ' Minutes');

           //return back to the dashboard
            var stateParams = { id:  $state.params.id };
            $state.go('dashboard', stateParams);

        }

        function cancelAddTimer() {
            var stateParams = { id: $state.params.id };
            $state.go('dashboard', stateParams);
        }
        
    }
})(); 