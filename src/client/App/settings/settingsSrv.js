/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    var settingsSrv = {};

    angular.module('app')
    .value('settingsSrv', settingsSrv);

    settingsSrv.showStatusLog = false;
    settingsSrv.showToast = {
        error: true,
        info: true,
        success: true,
        warning: true

    };
    settingsSrv.thermos = [
        { name: 'HLT / Kettle2', order: 0, chartEnabled: false },
        { name: 'Mash', order: 1, chartEnabled: false },
        { name: 'Kettle', order: 2, chartEnabled: false },
        { name: 'RIMS', order: 3, chartEnabled: false },

    ];
    settingsSrv.thermoNames = ['HLT / Kettle2', 'Mash', 'Kettle', 'RIMS'];

})();