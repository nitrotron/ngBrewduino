(function () {
    angular.module('app')
    .controller('rimsSettingsCtrl', rimsSettingsCtrl);

    function rimsSettingsCtrl($state, rimsSettingsSrv) {
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
            vm.settings = rimsSettingsSrv.settings;
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
            rimsSettingsSrv.updateSettings(settings);
        }
    }
})();