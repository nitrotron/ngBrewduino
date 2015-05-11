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
        { name: 'Mash', order: 0, chartEnabled: false, id: 0 },
        { name: 'Kettle', order: 1, chartEnabled: false, id: 1 },
        { name: 'HLT / Kettle2', order: 2, chartEnabled: false, id: 2 },
        { name: 'RIMS', order: 3, chartEnabled: false, id: 3 },

    ];
    settingsSrv.showBottomButtons = true;
    // settingsSrv.thermoNames = ['Mash', 'Kettle','HLT / Kettle2', 'RIMS'];

})();