﻿/// <reference path="../../3rdParty/script/angular.intellisense.js" />
/// <reference path="../../3rdParty/script/angular.js" />
// This is a service for getting/setting data from the arduino

(function () {
    angular.module('app')
        .factory('brewduionoDataSrv', brewduionoDataSrv);

    function brewduionoDataSrv($http, logger, settingsSrv, $interval) {
        var myCurrentStatus = {};
        var autoUpdatesEnabled = false;

        autoUpdates();
        return {
            getCurrentStatus: getCurrentStatus,
            getStatus: getStatus,
            sendCmd: sendCmd,
            setAutoUpdates: setAutoUpdates
        };

        function autoUpdates() {
            $interval(function () {
                if (autoUpdatesEnabled === true) {
                    getStatus();
                }
            }, 10000);
        }

        function getCurrentStatus() {
            return myCurrentStatus;
        }

        function getStatus() {
            var statusUrl = '/getStatus';
            return $http.get(statusUrl).success(function (data) {
                data.thermometers.forEach(function (element, index, array) {
                    element.name = settingsSrv.thermoNames[index];
                });

                myCurrentStatus = data;
            })
            .error(getStatusFailed);
        }
        function getStatusFailed(data) {
            logger.error('XHR Failed for getStatus.');
        }
        function getStatusSuccess(response) {
            logger.info('Successful getStatus');
            return response;
        }


        function sendCmd(whichCmd, args) {
            var cmdUrl = '/sendCommand/' + whichCmd + '/' + args;
            return $http.post(cmdUrl).error(sendCmdFail);
        }

        function sendCmdFail(data) {
            logger.error('XHR Failed for sendCommand.' + data);
        }

        function parseStatus(data) {
            var inData = JSON.deserialize(data);

        }

        function setAutoUpdates(enableUpdates) {
            autoUpdatesEnabled = enableUpdates;
        }
    }
}
)();