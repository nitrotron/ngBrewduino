(function () {
    angular.module('app')
    .controller('dbSettingsCtrl', dbSettingsCtrl);

    /* @ngInject */
    function dbSettingsCtrl($state, brewduionoDataSrv, brewduinoCmdsSrv, dbSettingsSrv, logger) {
        var vm = this;

        vm.cancel = cancel;
        vm.clearSessionData = clearSessionData;
        vm.dataLogClick = dataLogClick;
        vm.done = done;
        vm.submit = submit;

        activate();

        function activate() {
            vm.enableDataLogging = dbSettingsSrv.dataLoggingEnabled;
            vm.createNewSession = false;
            vm.newSessionName = '';
        }

        function cancel() {
            vm.createNewSession = false;
            vm.newSessionName = '';
        }

        function clearSessionData() {
            brewduionoDataSrv.clearSessionData().success(function (response) {
                logger.warning('You just cleared your database');
            });
        }

        function dataLogClick(enableData) {
            dbSettingsSrv.dataLoggingEnabled = enableData;
            if (enableData === 1 || enableData === true) {
                brewduinoCmdsSrv.startLogging();
            }
            else {
                brewduinoCmdsSrv.stopLogging();
            }
        }
        function done() {
            var stateParams = { id: $state.params.id };
            $state.go('dashboard', stateParams);
        }


        function submit(sessionName) {
            dbSettingsSrv.createNewSession(sessionName)
                .then(function (data) {
                    logger.success('Just created new session:' + sessionName);
            });

        }


    }
})();