(function () {
    angular.module('app')
    .controller('statusLogCtrl', statusLogCtrl);

    /* @ngInject */
    function statusLogCtrl(brewduionoDataSrv) {
        var vm = this;

        vm.statusInfo = brewduionoDataSrv.getCurrentStatus();
    }
})();