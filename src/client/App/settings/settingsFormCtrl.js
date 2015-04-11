/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
    .controller('settingsFormCtrl', settingsFormCtrl);

    function settingsFormCtrl($state, settingsSrv) {
        var vm = this;

        // properties
        vm.settings = {};

        // methods
        vm.cancel = cancel;
        vm.submit = submit;

        activate();


        function activate() {
            vm.settings = {
                showStatusLog: settingsSrv.showStatusLog,
                showToast: settingsSrv.showToast
            };
        }

        function cancel() {
            var stateParams = { id: $state.params.id };
            $state.go('dashboard', stateParams);
        }

        function submit(settings) {
            updateSettingSrv(settings);
            var stateParams = { id: $state.params.id };
            $state.go('dashboard', stateParams);
        }

        function updateSettingSrv(settings) {
            settingsSrv.showStatusLog = settings.showStatusLog;
            settingsSrv.showToast = settings.showToast;
        }
    }

})();