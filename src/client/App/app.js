/// <reference path='../3rdParty/script/angular.js' />
/// <reference path='../3rdParty/script/angular-ui-router.min.js' />
(function () {
    angular.module('app', ['timer', 'ui.router', 'googlechart', 'ngAnimate',
        'toaster', 'app.logger', 'ngAnimate', 'highcharts-ng', 'ngIOS9UIWebViewPatch']);
}());