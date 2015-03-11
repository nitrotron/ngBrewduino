/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/main');
        
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'App/brewduino/brewduino.html'
            })
        .state('temperature', {
            url: '/temperature/:id',
            templateUrl: 'App/brewduino/thermoDashBoard.html'
        });
    });
})();