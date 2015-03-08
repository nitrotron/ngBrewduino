/// <reference path="../../3rdParty/script/angular.intellisense.js" />
/// <reference path="../../3rdParty/script/angular.js" />
// This is a value service for defining the commands to be sent to the arduino
(function () {

    angular.module('app').factory('brewduinoCmdsSrv', brewduinoCmdsSrv);

    function brewduinoCmdsSrv(brewduionoDataSrv) {
        var cmds = {
            returnUnknownCmd: 0,
            returnStatus: 1,
            getTemps: 2,
            getTemp: 3,
            getSensors: 4,
            getSensor: 5,
            getTempAlarms: 6,
            setTempAlarmHigh: 7,
            setTempAlarmLow: 8,
            clearTempAlarms: 9, 
            getTimer: 10,
            setTimer: 11,
            resetAlarm: 12, 
            getAlarmStatus: 13,
            startLogging: 14,
            stopLogging: 15,
            setPIDSetPoint: 16,
            setPIDWindowSize: 17,
            setPIDKp: 18,
            setPIDKi: 19,
            setPIDKd: 20,
            turnOnRims: 21,
            turnOnPump: 22,
            turnOnAux: 23,
            setInitialClock: 24,
            setDebugModeOn: 25
        };
        return {
            cmds: cmds,

            clearAlarms: clearAlarms,
            resetAlarm: resetAlarm,
            setAuxPower: setAuxPower,
            setHighAlarms: setHighAlarms,
            setLowAlarms: setLowAlarms,
            setPidSetPoint: setPidSetPoint,
            setPidWindowSize: setPidWindowSize,
            setPidKp: setPidKp,
            setPidKi: setPidKi,
            setPidKd: setPidKd,
            setPumpsPower: setPumpsPower,
            setRimsPower: setRimsPower,
            setTimer: setTimer 
        };

        function clearAlarms(whichThermo) {
            return brewduionoDataSrv.sendCmd(cmds.clearTempAlarms, whichThermo);
        }
        function resetAlarm() {
            return brewduionoDataSrv.sendCmd(cmds.resetAlarm, '');
        }
        function setAuxPower(isPowerOn) {
            return brewduionoDataSrv.sendCmd(cmds.turnOnAux, isPowerOn);
        }
        function setHighAlarms(whichThermo, temp) {
            return brewduionoDataSrv.sendCmd(cmds.setTempAlarmHigh, whichThermo + ',' + temp);
        }
        function setLowAlarms(whichThermo, temp) {
            return brewduionoDataSrv.sendCmd(cmds.setTempAlarmLow, whichThermo + ',' + temp);
        }
        function setPidSetPoint(setPoint) {
            return brewduionoDataSrv.sendCmd(cmds.setPIDSetPoint, setPoint);
        }
        function setPidWindowSize(windowSize) {
            return brewduionoDataSrv.sendCmd(cmds.setPIDWindowSize, windowSize);
        }
        function setPidKp(kp) {
            return brewduionoDataSrv.sendCmd(cmds.setPIDKp, kp);
        }
        function setPidKi(ki) {
            return brewduionoDataSrv.sendCmd(cmds.setPIDKi, ki);
        }
        function setPidKd(kd) {
            return brewduionoDataSrv.sendCmd(cmds.setPIDKd, kd);
        }
        function setPumpsPower(isPowerOn) {
            return brewduionoDataSrv.sendCmd(cmds.turnOnPump, isPowerOn);
        }
        function setRimsPower(isPowerOn) {
            return brewduionoDataSrv.sendCmd(cmds.turnOnRims, isPowerOn);
        }
        function setTimer(minutes) {
            return brewduionoDataSrv.sendCmd(cmds.setTimer, minutes);
        }
    }
})();