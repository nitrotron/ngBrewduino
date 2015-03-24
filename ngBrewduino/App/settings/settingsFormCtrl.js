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
                useStubData: settingsSrv.useStubData,
                useMockServer: settingsSrv.useMockServer,
                url: settingsSrv.brewduinoUrlAndPort,
                showStatusLog: settingsSrv.showStatusLog
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
            settingsSrv.useStubData = settings.useStubData;
            settingsSrv.useMockServer = settings.useMockServer;
            settingsSrv.brewduinoUrlAndPort = settings.url;
            settingsSrv.showStatusLog = settings.showStatusLog;
        }
    }

})();