/**
 * Created by jessica on 1/20/2015.
 */
(function () {
    angular.module('app')
        .controller('brewingThermometer', brewingThermometer);

    function brewingThermometer($scope) {
        var makeRimsSettingsVisible = false;
        $scope.rimsSetPoint = 2000;
        $scope.rimsWindowSize = 5000;
        $scope.rimsKp = 5;
        $scope.rimsKi = 0.5;
        $scope.rimsKd = 1;

        $scope.openAlarmPanel = openAlarmPanel;

        $scope.showRimsButton = showRimsButton;
        $scope.showRimsSettings = showRimsSettings;
        $scope.rimsSettingVisible = rimsSettingVisible;

        $scope.showPnlAlarm = showPnlAlarm;
        $scope.curPnlAlarm = {temperature: -15, whichAlarm: 'highAlarm', whichAlarmDis: ''};

        $scope.btnUpdateAlarmsClick = btnUpdateAlarmsClick;
        $scope.btnCancelAlarmsClick = btnCancelAlarmsClick;

        $scope.btnUpdateRims_Click = btnUpdateRims_Click;
        $scope.btnUpdateRimsCancel_Click = btnUpdateRimsCancel_Click;

        var showWhichPnlAlarmId = -1;

        function openAlarmPanel(alarm, whichAlarm, id) {
            showWhichPnlAlarmId = id;
            $scope.curPnlAlarm.temperature = alarm;
            $scope.curPnlAlarm.whichAlarm = whichAlarm;
            $scope.curPnlAlarm.whichAlarmDis = whichAlarm.replace("Alarm", "").replace(/\w\S*/g, function (txt) {
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
            if (angular.isNumber($scope.curPnlAlarm.temperature)) {
                if (angular.isDefined(thermometer[$scope.curPnlAlarm.whichAlarm]))
                    thermometer[$scope.curPnlAlarm.whichAlarm] = $scope.curPnlAlarm.temperature;

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