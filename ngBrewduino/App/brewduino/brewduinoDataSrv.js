/// <reference path="../../3rdParty/script/angular.intellisense.js" />
/// <reference path="../../3rdParty/script/angular.js" />
// This is a service for getting/setting data from the arduino

(function () {
    angular.module('app')
        .factory('brewduionoDataSrv', brewduionoDataSrv);

    function brewduionoDataSrv($http, settingsSrv, mockRestSrv) {
        var currentStatus = {};
        return {
            getStatus:getStatus,
            sendCmd: sendCmd
        };

        function getStatus(statusData) {
            if (settingsSrv.useMockServer === true) {
                return mockRestSrv.getStatus(statusData);
            }
            var statusUrl = settingsSrv.brewduinoUrlAndPort + '/GetStatus';
            return $http.get(statusUrl).success(function (data) {
                statusData = data;
            });
        }
        function sendCmd(whichCmd, args) {
            if (settingsSrv.useMockServer === true) {
                return mockRestSrv.sendCmd(whichCmd,args);
            }
            var cmdUrl = settingsSrv.brewduinoUrlAndPort + '/SendCommand/' + whichCmd + '/' + args;
            return $http.post(cmdUrl);
        }

        function parseStatus(data) {
            var inData = JSON.deserialize(data);
            
        }
    }
}
)();