/// <reference path="../3rdParty/script/angular.js" />
/// <reference path="../3rdParty/script/angular-ui-router.min.js" />
(function () {
    angular.module('app')
        .controller('brewingThermoItem', brewingThermoItem);

    function brewingThermoItem($state, $scope, brewduinoCmdsSrv, brewduionoDataSrv,
                                 logger, settingsSrv, chartSrv) {
        var vm = this;
        var firstUpdate = false;

        vm.addTimer = addTimer;
        //vm.mcData = {};

        vm.alarmBtn = false;
        vm.auxClick = auxClick;
        //vm.chartData = chartData;
        //vm.chart = {};
        vm.chartTypeArea = true;
        vm.chartTypeLine = false;
        //vm.chartView = [];
        vm.changeChartType = changeChartType;
        vm.chBxChartChanged = chBxChartChanged;
        vm.closeMenu = closeMenu;
        vm.lastChartUpdate = new Date();
        vm.lastTempUpdate = new Date();
        vm.openMenu = openMenu;
        vm.pumpClick = pumpClick;
        vm.rimsClick = rimsClick;
        vm.setAlarm = setAlarm;
        vm.settingsClick = settingsClick;
        vm.showMenu = false;
        vm.showStatusLog = settingsSrv.showStatusLog;
        vm.otherThermos = [];
        vm.switchTemps = switchTemps;

        activate();




        function activate() {
            vm.chartOtherThermos = getOtherTheromosChart();
            settingsSrv.thermos.forEach(function (element, index, array) {
                element.chartEnabled = false;
            });
            settingsSrv.thermos[Number($state.params.id)].chartEnabled = true;
            //vm.chartView = { columns: getChartColumns() };
            //vm.mcData = brewduionoDataSrv.getCurrentStatus();
            updateVM(brewduionoDataSrv.getCurrentStatus());
            getStatus();
            getChartData();

            //.then(function (response) {
            //    //every 10 seconds get a status update
            //    //   $interval(getStatus, 10000);
            //    //every 60 seconds see if there is more chart data
            //    //    $interval(getChartData, 60000);
            //});

            brewduionoDataSrv.setAutoUpdates(true);
            chartSrv.setAutoUpdates(true);


            $scope.$watch(brewduionoDataSrv.getCurrentStatus,
                function (newValue, oldValue) {
                    updateVM(newValue);
                    logger.success('Updated status', newValue);
                });
            $scope.$watch(chartSrv.getCurrentData,
                function (newValue, oldValue) {
                    //var view;

                    //if (vm.hasOwnProperty('chart') && vm.chart.hasOwnProperty('view')) {
                    //    view = vm.chart.view;
                    //}
                     
                    //vm.chart = newValue;
                    //if (view) {
                    //    vm.chart.view = view;
                    //}
                    if (vm.hasOwnProperty('chart') && vm.chart.hasOwnProperty('data')) {
                        vm.chart.data.rows = chartSrv.getCurrentData();
                        //vm.chart.view = vm.chartView;
                        vm.lastChartUpdate = new Date();
                        logger.success('Updated chart', newValue);
                    }
                });
        }

        function addTimer() {
            var stateParams = { id: $state.params.id };
            $state.go('cdtAdd', stateParams);
        }

        function auxClick() {
            vm.auxOn = !vm.auxOn;
            brewduinoCmdsSrv.setAuxPower(vm.auxOn);
        }

        function changeChartType(chartType) {
            vm.chart.type = chartType;
        }
        function chBxChartChanged(thermo) {
            vm.chart.view = { columns: getChartColumns() };
        }

        function closeMenu() {
            vm.showMenu = false;
        }

        function getChartData() {
            if (firstUpdate === true) {

                chartSrv.getChartData()
                .then(function (data) {
                    vm.chart.data.rows = data;
                    //logger.success('Updated chart', brewduionoDataSrv.getCurrentStatus());
                });
            }
        }

        function getStatus() {
            return brewduinoCmdsSrv.getStatus()
             .then(function (response) {

                 updateVM(response.data);

                 vm.chart = chartSrv.getChartConfig();
                 vm.chart.view = { columns: getChartColumns() };
                 getChartData();


                 logger.success('Updated status', response.data);
                 return response;
             });
        }

        function openMenu() {
            vm.showMenu = true;
        }

        function getChartColumns() {
            var rc = [0];
            settingsSrv.thermos.forEach(function (element, index, array) {
                if (element.chartEnabled || index === Number($state.params.id)) {
                    rc.push(index + 1);
                }
            });
            return rc;
        }

        function getOtherThermos() {
            var rc = [];
            var currentStatus = brewduionoDataSrv.getCurrentStatus();
            if (currentStatus.hasOwnProperty('thermometers')) {
                currentStatus.thermometers.forEach(function (element, index, array) {
                    if (index !== Number($state.params.id)) {
                        rc.push(element);
                    }
                });
            }
            return rc;
        }

        function getOtherTheromosChart() {
            var rc = [];
            settingsSrv.thermos.forEach(function (element, index, array) {
                if (index !== Number($state.params.id)) {
                    rc.push(element);
                }
            });

            return rc;
        }

        function pumpClick() {
            vm.pumpOn = !vm.pumpOn;
            brewduinoCmdsSrv.setPumpsPower(vm.pumpOn);
        }

        function rimsClick() {
            vm.rimsEnable = !vm.rimsEnable;
            brewduinoCmdsSrv.setRimsPower(vm.rimsEnable);
        }

        function setAlarm() {
            vm.alarmBtn = !vm.alarmBtn;
            brewduinoCmdsSrv.resetAlarm();
        }

        function settingsClick() {
            var stateParams = { id: $state.params.id };
            $state.go('settings', stateParams);
        }

        function switchTemps(thermometer) {
            var stateParams = { id: thermometer.id };
            $state.go('dashboard', stateParams);
        }


        function updateVM(responseData) {
            //vm.mcData = responseData;
            vm.rimsEnable = responseData.rimsEnable;
            vm.pumpOn = responseData.pumpOn;
            vm.auxOn = responseData.auxOn;

            vm.otherThermos = getOtherThermos();
            if (responseData.hasOwnProperty('thermometers')) {
                if (firstUpdate === false) {
                    responseData.thermometers.forEach(function (element, index, array) {
                        if (index === Number($state.params.id)) {
                            element.chartEnabled = true;
                        } else {
                            element.chartEnabled = false;
                        }
                    });
                    firstUpdate = true;

                }
                vm.thermometersList = [responseData.thermometers[$state.params.id]];
                vm.thermo = responseData.thermometers[$state.params.id];

            }
            vm.lastTempUpdate = new Date();


        }


    }
})();