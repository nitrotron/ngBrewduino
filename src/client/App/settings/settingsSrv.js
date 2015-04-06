/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    var settingsSrv = {};

    angular.module('app')
    .value('settingsSrv', settingsSrv);

    settingsSrv.useStubData = true;
    settingsSrv.useMockServer = false;
    settingsSrv.showStatusLog = false;
    settingsSrv.brewduinoUrlAndPort = 'http://localhost:51887/SerialSwitch';
    settingsSrv.showToast = {
        error: true,
        info: true,
        success: true,
        warning: true

    };
    settingsSrv.thermoNames = ['RIMS', 'Mash', 'Kettle', 'HLT / Kettle2'];

})();