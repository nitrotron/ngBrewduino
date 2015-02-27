/**
 * Created by jessica on 1/20/2015.
 */
(function () {
    angular.module('app')
        .controller('brewingThermometer', brewingThermometer);

    function brewingThermometer(brewduinoCmdsSrv) {
        var vm = this;
        vm.rimsSetPoint = 2000;
        vm.rimsWindowSize = 5000;
        vm.rimsKp = 5;
        vm.rimsKi = 0.5;
        vm.rimsKd = 1;

        vm.openAlarmPanel = openAlarmPanel;

        vm.showRimsButton = showRimsButton;
        vm.showRimsSettings = showRimsSettings;
        vm.rimsSettingVisible = false;

        vm.showPnlAlarm = showPnlAlarm;
        vm.curPnlAlarm = {};

        vm.btnUpdateAlarmsClick = btnUpdateAlarmsClick;
        vm.btnCancelAlarmsClick = btnCancelAlarmsClick;

        vm.btnUpdateRimsClick = btnUpdateRimsClick;
        vm.btnUpdateRimsCancelClick = btnUpdateRimsCancelClick;

        var showWhichPnlAlarmId = -1;

        function openAlarmPanel(alarm, whichAlarm, id) {
            showWhichPnlAlarmId = id;
            vm.curPnlAlarm.temperature = alarm;
            vm.curPnlAlarm.whichAlarm = whichAlarm;
            vm.curPnlAlarm.whichAlarmDis = whichAlarm.replace('Alarm', '').replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

        }

        function showRimsButton(thermoObj) {
            return (angular.isObject(thermoObj) && angular.isDefined(thermoObj.isRIMS) && thermoObj.isRIMS === true);
        }

        function showRimsSettings() {
            vm.rimsSettingVisible = (vm.rimsSettingVisible === true) ? false : true;
        }


        function showPnlAlarm(thermometer) {
            return (thermometer.id === showWhichPnlAlarmId);
        }

        function btnUpdateAlarmsClick(thermometer) {
            if (angular.isNumber(vm.curPnlAlarm.temperature)) {
                if (angular.isDefined(thermometer[vm.curPnlAlarm.whichAlarm])) {
                    thermometer[vm.curPnlAlarm.whichAlarm] = vm.curPnlAlarm.temperature;
                    if (vm.curPnlAlarm.whichAlarm === 'highAlarm') {
                        brewduinoCmdsSrv.setTempAlarmHigh(thermometer.id, vm.curPnlAlarm.temperature);
                    }
                    else if (vm.curPnlAlarm.whichAlarm === 'lowAlarm') {
                        brewduinoCmdsSrv.setTempAlarmLow(thermometer.id, vm.curPnlAlarm.temperature);
                    }
                }

                showWhichPnlAlarmId = -1;
            }
        }

        function btnCancelAlarmsClick() {
            showWhichPnlAlarmId = -1;
        }

        function btnUpdateRimsClick() {
            vm.rimsSettingVisible = false;
            brewduinoCmdsSrv.setPidSetPoint(vm.rimsSetPoint);
            brewduinoCmdsSrv.setPidWindowSize(vm.rimsWindowSize);
            brewduinoCmdsSrv.setPidKp(vm.rimsKp);
            brewduinoCmdsSrv.setPidKi(vm.rimsKi);
            brewduinoCmdsSrv.setPidKd(vm.rimsKd);
        }

        function btnUpdateRimsCancelClick() {
            vm.rimsSettingVisible = false;
        }
    }
})();