(function () {
    angular.module('app')
    .controller('rimsSettingsCtrl', rimsSettingsCtrl);

    function rimsSettingsCtrl($state, brewduionoDataSrv, brewduinoCmdsSrv) {
        var vm = this;
        //rimsSettingsSrv.setPoint = 150;
        //rimsSettingsSrv.windowSize = 5000;
        //rimsSettingsSrv.kp = 2000;
        //rimsSettingsSrv.ki = 1;
        //rimsSettingsSrv.kd = 2;

        vm.settings = {};

        vm.cancel = cancel;
        vm.submit = submit;

        activate();

        function activate() {
            vm.settings = brewduionoDataSrv.getCurrentStatus();
        }

        function cancel() {
            var stateParams = { id: $state.params.id };
            $state.go('dashboard', stateParams);
        }

        function submit(settings) {
            updateRimsSettingsSrv(settings);
            var stateParams = { id: $state.params.id };
            $state.go('dashboard', stateParams);
        }

        function updateRimsSettingsSrv(settings) {
            brewduinoCmdsSrv.setPidSetPoint(settings.setPoint);
            brewduinoCmdsSrv.setPidWindowSize(settings.windowSize);
            brewduinoCmdsSrv.setPidKp(settings.kp);
            brewduinoCmdsSrv.setPidKi(settings.ki);
            brewduinoCmdsSrv.setPidKd(settings.kd);
        }
    }
})();