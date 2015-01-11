/**
 * Created by jessica on 12/31/2014.
 */
(function () {


    function brewduinoCtrl($scope, stubData) {
        var makeRimsSettingsVisible = false;
        $scope.message = 'hello world';
        $scope.temp0 = "123.4";
        $scope.temp1 = "23.4";
        $scope.temp2 = "33.4";
        $scope.temp3 = "13.4";
        $scope.rimsSetPoint = 2000;
        $scope.rimsWindowSize = 5000;
        $scope.rimsKp = 5;
        $scope.rimsKi = 0.5;
        $scope.rimsKd = 1;
        $scope.timers = [];
        $scope.newTimer = 0;
        $scope.newTimerLabel = "";

        $scope.stubData = stubData;

        $scope.openAlarmPanel = openAlarmPanel;

        $scope.showRimsButton = showRimsButton;
        $scope.showRimsSettings = showRimsSettings;
        $scope.rimsSettingVisible = rimsSettingVisible;

        $scope.showPnlAlarm = showPnlAlarm;
        $scope.curPnlAlarm = {temperature: -15, whichAlarm: 'highAlarm', whichAlarmDis:''};

        $scope.btnUpdateAlarmsClick = btnUpdateAlarmsClick;
        $scope.btnCancelAlarmsClick = btnCancelAlarmsClick;

        $scope.btnUpdateRims_Click = btnUpdateRims_Click;
        $scope.btnUpdateRimsCancel_Click = btnUpdateRimsCancel_Click;


        $scope.showAddTimerPanel = false;

        $scope.addTimer = addTimer;
        $scope.startNewTimer = startNewTimer;
        $scope.cancelNewTimer = cancelNewTimer;


        function showRimsButton(thermoObj) {
            return (angular.isObject(thermoObj) && angular.isDefined(thermoObj.isRIMS) && thermoObj.isRIMS == true)
        }

        function showRimsSettings() {
            makeRimsSettingsVisible = (makeRimsSettingsVisible == true) ? false : true;
        }

        function rimsSettingVisible() {
            return makeRimsSettingsVisible;
        }

        var showWhichPnlAlarmId = -1;

        function showPnlAlarm(thermometer) {
            return (thermometer.id === showWhichPnlAlarmId)
        }

        function openAlarmPanel(alarm, whichAlarm, id) {
            showWhichPnlAlarmId = id;
            $scope.curPnlAlarm.temperature = alarm;
            $scope.curPnlAlarm.whichAlarm = whichAlarm;
            $scope.curPnlAlarm.whichAlarmDis = whichAlarm.replace("Alarm","").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

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


        function addTimer() {
            $scope.showAddTimerPanel = true;
        }

        function startNewTimer(newTimer,newTimerLabel) {
            $scope.showAddTimerPanel = false;
            var myObj = {timer: (newTimer*60), label: newTimerLabel};
            $scope.timers.push(myObj);
        }

        function cancelNewTimer() {
            $scope.showAddTimerPanel = false;
        }

    }

    angular.module('brewduinoApp')
        .controller('brewduinoCtrl', brewduinoCtrl);
})();