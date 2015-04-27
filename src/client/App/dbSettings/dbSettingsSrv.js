/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .factory('dbSettingsSrv', dbSettingsSrv);

    /* @ngInject */
    function dbSettingsSrv($http, $q) {
        var dataLoggingEnabled = false;
        return {
            createNewSession: createNewSession,
            dataLoggingEnabled: dataLoggingEnabled
        };

        function createNewSession(sessionName) {
            var url = '/createNewSession';
            var deferred = new $q.defer();

            $http.post(url, { 'sessionName': sessionName }).success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data, status) {
                deferred.reject(data);
            });

            return deferred.promise;
        }
    }


})();