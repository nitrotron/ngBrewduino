/// <reference path="../../3rdParty/script/angular.intellisense.js" />
/// <reference path="../../3rdParty/script/angular.js" />
// This is a value service for defining the commands to be sent to the arduino
(function () {

    angular.module('app').factory('brewduinoCmdsSrv', brewduinoCmdsSrv);

    function brewduinoCmdsSrv(brewduionoDataSrv, logger) {
        var cmds = {
            returnUnknownCmd: 0,
            returnStatus: 1,
            setTempAlarmHigh: 2,
            setTempAlarmLow: 3,
            clearTempAlarms: 4,
            setTimer: 5,
            resetAlarm: 6,
            startLogging: 7,
            stopLogging: 8,
            setPIDSetPoint: 9,
            setPIDWindowSize: 10,
            setPIDKp: 11,
            setPIDKi: 12,
            setPIDKd: 13,
            turnOnRims: 14,
            turnOnPump: 15,
            turnOnAux: 16,
            setInitialClock: 17
        };
        return {
            cmds: cmds,

            clearAlarms: clearAlarms,
            getStatus: getStatus,
            resetAlarm: resetAlarm,
            startLogging: startLogging,
            stopLogging: stopLogging,
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
            return brewduionoDataSrv.sendCmd(cmds.clearTempAlarms, whichThermo)
                    .error(function () {
                        sendCommandFailed('clearAlarms', '');
                    });
        }
        function getStatus(status) {
            return brewduionoDataSrv.getStatus(status);
        }
        function resetAlarm() {
            return brewduionoDataSrv.sendCmd(cmds.resetAlarm, 1);
        }
        function setAuxPower(isPowerOn) {
            return brewduionoDataSrv.sendCmd(cmds.turnOnAux, isPowerOn ? 1 : 0);
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
            return brewduionoDataSrv.sendCmd(cmds.turnOnPump, isPowerOn ? 1 : 0);
        }
        function setRimsPower(isPowerOn) {
            return brewduionoDataSrv.sendCmd(cmds.turnOnRims, isPowerOn ? 1 : 0);
        }
        function setTimer(minutes) {
            return brewduionoDataSrv.sendCmd(cmds.setTimer, minutes);
        }
        function startLogging() {
            return brewduionoDataSrv.sendCmd(cmds.startLogging, 1);
        }
        function stopLogging() {
            return brewduionoDataSrv.sendCmd(cmds.stopLogging,1);
        }

        function sendCommandFailed(command, args) {
            logger.error('XHR Failed for send command:' + command + ' ' + args);
        }
    }
})();