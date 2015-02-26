/// <reference path="../../3rdParty/script/angular.intellisense.js" />
/// <reference path="../../3rdParty/script/angular.js" />
// This is a value service for defining the commands to be sent to the arduino
(function () {
    var cmds = {
        ReturnUnknownCmd: 0,
        ReturnStatus: 1,
        GetTemps: 2,
        GetTemp: 3,
        GetSensors: 4,
        GetSensor: 5,
        GetTempAlarms: 6,
        SetTempAlarmHigh: 7,
        SetTempAlarmLow: 8,
        ClearTempAlarms: 9,
        GetTimer: 10,
        SetTimer: 11,
        ResetAlarm: 12,
        GetAlarmStatus: 13,
        StartLogging: 14,
        StopLogging: 15,
        SetPIDSetPoint: 16,
        SetPIDWindowSize: 17,
        SetPIDKp: 18,
        SetPIDKi: 19,
        SetPIDKd: 20,
        TurnOnRims: 21,
        TurnOnPump: 22,
        TurnOnAux: 23,
        SetInitialClock: 24,
        SetDebugModeOn: 25
    };

    angular.module('app').value('brewduinoCmds', cmds);
})();