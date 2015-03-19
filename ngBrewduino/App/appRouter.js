/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/main/0');
        
        $stateProvider
            .state('main', {
                url: '/main/:id',
                templateUrl: 'App/brewduino/brewduino.html'
            })
        .state('temperature', {
            url: '/temperature/:id',
            templateUrl: 'App/brewduino/thermoDashBoard.html'
        });
    });
})();