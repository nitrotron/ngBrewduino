﻿/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    var settingsSrv = {};

    angular.module('app')
    .value('settingsSrv', settingsSrv);

    settingsSrv.useStubData = true;
    settingsSrv.useMockServer = false;
    settingsSrv.brewduinoUrlAndPort = 'http://localhost:51887/SerialSwitch';
})();