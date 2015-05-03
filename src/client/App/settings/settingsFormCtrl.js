/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
    .controller('settingsFormCtrl', settingsFormCtrl);

    /* @ngInject */
    function settingsFormCtrl($state, settingsSrv, brewduionoDataSrv, logger) {
        var vm = this;

        // properties
        vm.settings = {};
        vm.showThermoName = [];
        vm.showThermoOrder = [];

        // methods
        vm.cancel = cancel;
        vm.clearSessionData = clearSessionData;
        vm.clickThermoName = clickThermoName;
        vm.clickThermoOrder = clickThermoOrder;
        vm.exitThermoName = exitThermoName;
        vm.exitThermoOrder = exitThermoOrder;
        vm.submit = submit;

        activate();


        function activate() {
            vm.settings = {
                showBottomButtons: settingsSrv.showBottomButtons,
                showStatusLog: settingsSrv.showStatusLog,
                showToast: settingsSrv.showToast,
                thermos: settingsSrv.thermos
            };

            vm.settings.thermos.forEach(function (val, index, array) {
                vm.showThermoName.push(false);
                vm.showThermoOrder.push(false);
            });

        }

        function cancel() {
            var stateParams = { id: $state.params.id };
            $state.go('dashboard', stateParams);
        }

        function clearSessionData() {
            brewduionoDataSrv.clearSessionData().success(function (response) {
                logger.warning('You just cleared your database');
            });
        }

        function clickThermoName(thermo) {
            vm.showThermoName[thermo.id] = true;
        }
        function clickThermoOrder(thermo) {
            vm.showThermoOrder[thermo.id] = true;
        }

        function exitThermoName(thermo) {
            vm.showThermoName[thermo.id] = false;
        }
        function exitThermoOrder(thermo) {
            vm.showThermoOrder[thermo.id] = false;
        }

        function submit(settings) {
            updateSettingSrv(settings);
            var stateParams = { id: $state.params.id };
            $state.go('dashboard', stateParams);
        }

        function updateSettingSrv(settings) {
            settingsSrv.showStatusLog = settings.showStatusLog;
            settingsSrv.showToast = settings.showToast;
            settingsSrv.showBottomButtons = settings.showBottomButtons;
        }
    }

})();