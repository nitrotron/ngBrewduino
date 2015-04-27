(function () {
    angular.module('app')
    .controller('countDownTimerFormCtrl', countDownTimerFormCtrl);

    /* @ngInject */
    function countDownTimerFormCtrl($state, brewduinoCmdsSrv, countDownTimerSrv, logger) {
        var vm = this;

        vm.addTimer = addTimer;
        vm.cancelAddTimer = cancelAddTimer;

        function addTimer(newTimer, newTimerLabel) {
            var alarmTime = new Date();
            alarmTime.setSeconds(alarmTime.getSeconds() + (newTimer * 60));
            var timerIndex = countDownTimerSrv.getTimers().length + 1;
            var myObj = { id: timerIndex, timer: alarmTime, label: newTimerLabel, isActive: true };
            timerIndex++;
            countDownTimerSrv.addTimer(myObj);
            //dateSnapShot = new Date();
            brewduinoCmdsSrv.setTimer(newTimer);
            
            
            logger.success('Added Timer ' + newTimer + ' Minutes', newTimer);

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