(function () {
    angular.module('app')
    .controller('statusLogCtrl', statusLogCtrl);

    function statusLogCtrl(stubData) {
        var vm = this;

        vm.statusInfo = stubData;
    }
})();