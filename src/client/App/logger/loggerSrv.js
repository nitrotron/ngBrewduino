(function () {
    angular.module('app.logger')
    .factory('logger', logger);

    
    /* @ngInject */
    function logger($log, toaster, settingsSrv) {
        var service = {
            showToasts: true,

            error: error,
            info: info,
            success: success,
            warning: warning,

            // straight to console; bypass toastr
            log: $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            if (settingsSrv.showToast.error === true) {
                toaster.error(message, title);
            }
            $log.error('Error: ' + message, data);

        }

        function info(message, data, title) {
            if (settingsSrv.showToast.info === true) {
                toaster.info(message, title);
            }
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            if (settingsSrv.showToast.success === true) {
                toaster.success(message, title);
            }
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            if (settingsSrv.showToast.warning === true) {
                toaster.warning(message, title);
            }
           
            $log.warn('Warning: ' + message, data);
        }
    }

})();