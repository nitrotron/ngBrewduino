/// <reference path="../../3rdParty/script/angular.intellisense.js" />
/// <reference path="../../3rdParty/script/angular.js" />
// This is a service for getting/setting data from the arduino

(function () {
    angular.module('app')
        .factory('brewduionoDataSrv', brewduionoDataSrv);

    function brewduionoDataSrv($http, basePortUrl) {
        var currentStatus = {};
        return {
            getStatus:getStatus,
            sendCmd: sendCmd
        };

        function getStatus(statusData) {
            var statusUrl = basePortUrl + '/GetStatus';
            return $http.get(statusUrl).success(function (data) {
                statusData = data;
            });
        }
        function sendCmd(whichCmd, args) {
            var cmdUrl = basePortUrl + '/SendCommand/' + whichCmd + '/' + args;
            return $http.post(cmdUrl);
        }

        function parseStatus(data) {
            var inData = JSON.deserialize(data);
            
        }
    }
}
)();