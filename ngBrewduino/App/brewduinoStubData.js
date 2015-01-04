/**
 * Created by jessica on 1/1/2015.
 */
(function () {
    var stubData = {
        thermometers: [
            {temp: 100, highAlarm: 200, lowAlarm:15, name: 'RIMs', isRIMS: true},
            {temp: 110, highAlarm: 210, lowAlarm:25, name: 'Mash'},
            {temp: 120, highAlarm: 220, lowAlarm:35, name: 'HLT'},
            {temp: 130, highAlarm: 230, lowAlarm:45, name: 'Kettle'}
        ],

        //Thermometer0: 100,
        //ThermometerHighAlarm0: 200,
        //ThermometerLowAlarm0: 40,
        TotalTimers: 12,
        RimsEnable: false,
        AuxOn: false,
        PumpOn: false,
        WhichThermoAlarm: 'kettle',
        TimersNotAllocated: 3,
        Kp: 200,
        Ki: 1,
        kd: 1,
        SetPoint: 100,
        WindowSize: 5000,
        TempAlarmActive: false,
        TimerAlarmActive: false

    };

    angular.module('brewduinoApp')
        .value('stubData', stubData);
})();