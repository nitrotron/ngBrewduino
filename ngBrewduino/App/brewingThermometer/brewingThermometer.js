/**
 * Created by jessica on 1/20/2015.
 */
(function () {
    angular.module('app')
        .controller('brewingThermometer', brewingThermometer);

    function brewingThermometer() {
        var vm = this;
        var makeRimsSettingsVisible = false;
        vm.rimsSetPoint = 2000;
        vm.rimsWindowSize = 5000;
        vm.rimsKp = 5;
        vm.rimsKi = 0.5;
        vm.rimsKd = 1;

        vm.openAlarmPanel = openAlarmPanel;

        vm.showRimsButton = showRimsButton;
        vm.showRimsSettings = showRimsSettings;
        vm.rimsSettingVisible = rimsSettingVisible;

        vm.showPnlAlarm = showPnlAlarm;
        vm.curPnlAlarm = {temperature: -15, whichAlarm: 'highAlarm', whichAlarmDis: ''};

        vm.btnUpdateAlarmsClick = btnUpdateAlarmsClick;
        vm.btnCancelAlarmsClick = btnCancelAlarmsClick;

        vm.btnUpdateRims_Click = btnUpdateRims_Click;
        vm.btnUpdateRimsCancel_Click = btnUpdateRimsCancel_Click;

        var showWhichPnlAlarmId = -1;

        function openAlarmPanel(alarm, whichAlarm, id) {
            showWhichPnlAlarmId = id;
            vm.curPnlAlarm.temperature = alarm;
            vm.curPnlAlarm.whichAlarm = whichAlarm;
            vm.curPnlAlarm.whichAlarmDis = whichAlarm.replace("Alarm", "").replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

        }

        function showRimsButton(thermoObj) {
            return (angular.isObject(thermoObj) && angular.isDefined(thermoObj.isRIMS) && thermoObj.isRIMS == true)
        }

        function showRimsSettings() {
            makeRimsSettingsVisible = (makeRimsSettingsVisible == true) ? false : true;
        }

        function rimsSettingVisible() {
            return makeRimsSettingsVisible;
        }

        function showPnlAlarm(thermometer) {
            return (thermometer.id === showWhichPnlAlarmId)
        }

        function btnUpdateAlarmsClick(thermometer) {
            if (angular.isNumber(vm.curPnlAlarm.temperature)) {
                if (angular.isDefined(thermometer[vm.curPnlAlarm.whichAlarm]))
                    thermometer[vm.curPnlAlarm.whichAlarm] = vm.curPnlAlarm.temperature;

                showWhichPnlAlarmId = -1;
            }
        }

        function btnCancelAlarmsClick() {
            showWhichPnlAlarmId = -1;
        }

        function btnUpdateRims_Click() {
            makeRimsSettingsVisible = false;
        }

        function btnUpdateRimsCancel_Click() {
            makeRimsSettingsVisible = false;
        }
    }
})();