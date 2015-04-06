(function () {
    angular.module('app')
    .controller('statusLogCtrl', statusLogCtrl);

    function statusLogCtrl(brewduionoDataSrv) {
        var vm = this;

        vm.statusInfo = brewduionoDataSrv.getCurrentStatus();
    }
})();