(function () {

    angular.module('app')
    .factory('rimsSettingsSrv', rimsSettingsSrv);


    function rimsSettingsSrv() {
        var settings = {};

        settings.setPoint = 150;
        settings.windowSize = 5000;
        settings.kp = 2000;
        settings.ki = 1;
        settings.kd = 2;

        return {
            settings: settings,
            updateSettings : updateSettings
        };

        
        function updateSettings(newSettings) {
            settings = newSettings;
        }

    }
})();