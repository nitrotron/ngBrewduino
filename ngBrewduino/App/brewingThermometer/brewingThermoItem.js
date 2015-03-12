/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('brewingThermoItem', brewingThermoItem);

    function brewingThermoItem($state, stubData, chartData) {
        var vm = this;

        vm.chartData = chartData;
        vm.thermometersList = [stubData.thermometers[$state.params.id]];

        activate();

        function activate() {
            console.log('you are here');
        }
    }
})(); 