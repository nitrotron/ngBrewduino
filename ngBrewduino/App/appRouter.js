/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
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
            templateUrl: 'App/brewduino/thermoDashBoard.html'
        })
        .state('cdtAdd', {
            url: '/cdtAdd/:id',
            templateUrl: 'App/countDownTimerForm/countDownTimerForm.html'
        });
        });
    })();