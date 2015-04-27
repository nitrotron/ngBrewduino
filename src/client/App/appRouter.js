/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
/// <reference path="databaseSettings/dbSettingsForm.html" />
/// <reference path="dashboard/dashboard.html" />
(function () {
    angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/classic');

        $stateProvider
            .state('classic', {
                url: '/classic',
                templateUrl: 'App/brewduino/brewduino.html'
            })
        .state('dashboard', {
            url: '/dashboard/:id',
            templateUrl: 'App/dashboard/dashboard.html'
        })
            .state('settings', {
                url: '/settings/:id',
                templateUrl: 'App/settings/settingsForm.html'
            })
        .state('cdtAdd', {
            url: '/cdtAdd/:id',
            templateUrl: 'App/countDownTimerForm/countDownTimerForm.html'
        })
        .state('rimsSettings', {
            url: '/rimsSettings/:id',
            templateUrl: 'App/rimsSettings/rimsSettingsForm.html'
            
        })
        .state('dbSettings', {
            url: '/dbSettings/:id',
            templateUrl: 'App/dbSettings/dbSettingsForm.html'

        });
    });
})();