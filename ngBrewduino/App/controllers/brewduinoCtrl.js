/**
 * Created by jessica on 12/31/2014.
 */
(function() {


    function brewduinoCtrl($scope, stubData) {
        $scope.message = 'hello world';
        $scope.temp0 = "123.4";
        $scope.temp1 = "23.4";
        $scope.temp2 = "33.4";
        $scope.temp3 = "13.4";

        $scope.stubData = stubData;
    };

    angular.module('brewduinoApp')
        .controller('brewduinoCtrl', brewduinoCtrl);
})();