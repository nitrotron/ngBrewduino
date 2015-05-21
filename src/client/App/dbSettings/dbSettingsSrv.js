/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .factory('dbSettingsSrv', dbSettingsSrv);

    /* @ngInject */
    function dbSettingsSrv($http, $q, chartSrv) {
        var dataLoggingEnabled = false;
        var currentSession;

       
        return {
            createNewSession: createNewSession,
            getCurrentSession: getCurrentSession,
            dataLoggingEnabled: dataLoggingEnabled
        };

        function createNewSession(sessionName) {
            var url = '/createNewSession';
            var deferred = new $q.defer();

            $http.post(url, { 'sessionName': sessionName }).success(function (data) {
                deferred.resolve(data);
                currentSession = {'sessionName': sessionName};
            })
            .error(function (data, status) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getCurrentSession() {
            var deferred = new $q.defer();
            if (currentSession) {
                deferred.resolve(currentSession);
                return deferred.promise;
            }

            chartSrv.getCurrentSession()
                .then(function (data) {
                    currentSession = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }
    }


})();