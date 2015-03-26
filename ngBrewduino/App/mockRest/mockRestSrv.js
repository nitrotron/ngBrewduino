(function () {
    angular.module('app')
    .factory('mockRestSrv', mockRestSrv);

    function mockRestSrv($q, $timeout, stubData) {
        return {
            getStatus: getStatus,
            sendCmd: sendCmd
        };

        

        function getStatus(statusData) {
            var deferred = $q.defer();

            statusData = stubData;

            $timeout(function () {
                deferred.resolve(stubData);
            }, 2000);

            return deferred.promise;
        }

        function sendCmd(whichCmd, args) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(stubData);
            }, 2000);


        }
    }
})();