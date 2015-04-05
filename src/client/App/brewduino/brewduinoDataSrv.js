/// <reference path="../../3rdParty/script/angular.intellisense.js" />
/// <reference path="../../3rdParty/script/angular.js" />
// This is a service for getting/setting data from the arduino

(function () {
    angular.module('app')
        .factory('brewduionoDataSrv', brewduionoDataSrv);

    function brewduionoDataSrv($http, logger, settingsSrv) {
        var currentStatus = {};
        return {
            currentStatus: currentStatus,
            getStatus: getStatus,
            sendCmd: sendCmd
        };




        function getStatus(statusData) {
            var statusUrl = '/getStatus';
            return $http.get(statusUrl).success(function (data) {
                data.thermometers.forEach(function (element, index, array) {
                    element.name = settingsSrv.thermoNames[index];
                });

                statusData = data;
                currentStatus = data;
            });
        }
        function getStatusFailed(error) {
            logger.error('XHR Failed for getStatus.' + error.data);
        }
        function getStatusSuccess(response) {
            logger.info('Successful getStatus');
            return response;
        }


        function sendCmd(whichCmd, args) {
            var cmdUrl =  '/sendCommand/' + whichCmd + '/' + args;
            return $http.post(cmdUrl);
        }

        function parseStatus(data) {
            var inData = JSON.deserialize(data);

        }
    }
}
)();