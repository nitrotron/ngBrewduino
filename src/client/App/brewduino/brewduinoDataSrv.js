/// <reference path="../../3rdParty/script/angular.intellisense.js" />
/// <reference path="../../3rdParty/script/angular.js" />
// This is a service for getting/setting data from the arduino

(function () {
    angular.module('app')
        .factory('brewduionoDataSrv', brewduionoDataSrv);

    function brewduionoDataSrv($http, logger, settingsSrv, $interval, socket, $rootScope) {
        var myCurrentStatus = {};
        var dataSubscribers = {
            status: []
        };

        var autoUpdatesEnabled = false;


        socket.on('status', function (data) {
                logger.info('Recieved message on socket', data);
                data.thermometers.forEach(function (element, index, array) {
                    element.name = settingsSrv.thermos[index].name;
                    element.order = settingsSrv.thermos[index].order;
                    if (element.hasOwnProperty('highAlarm') === true) {
                        element.highAlarm = Number(element.highAlarm.toFixed(1));
                    }
                    if (element.hasOwnProperty('lowAlarm') === true) {
                        element.lowAlarm = Number(element.lowAlarm.toFixed(1));
                    }
                });

                myCurrentStatus = data;
                emit(data, 'status');
        });

        socket.on('statusX', function (data) {
            //logger.info('gotA statusX',data);
        });
        socket.on('newTimer', function (data) {
            emit(data, 'newTimer');
        });


        //autoUpdates();
        return {
            clearSessionData: clearSessionData,
            getCurrentStatus: getCurrentStatus,
            getStatus: getStatus,
            restartPort: restartPort,
            sendCmd: sendCmd,
            setAutoUpdates: setAutoUpdates,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };

        // function autoUpdates() {
        //     //$interval(function () {
        //     //    if (autoUpdatesEnabled === true) {
        //     //        getStatus();
        //     //    }
        //     //}, 150000000);
        // }

        function getCurrentStatus() {
            return myCurrentStatus;
        }

        function getStatus() {
            //var statusUrl = '/getStatus';
            //return $http.get(statusUrl).success(function (data) {
            //    data.thermometers.forEach(function (element, index, array) {
            //        element.name = settingsSrv.thermos[index].name;
            //        element.order = settingsSrv.thermos[index].order;
            //        if (element.hasOwnProperty('highAlarm') === true) {
            //            element.highAlarm = Number(element.highAlarm.toFixed(1));
            //        }
            //        if (element.hasOwnProperty('lowAlarm') === true) {
            //            element.lowAlarm = Number(element.lowAlarm.toFixed(1));
            //        }
            //    });

            //    myCurrentStatus = data;
            //})
            //.error(getStatusFailed);

            socket.emit('getStatus', {});
        }

        function clearSessionData() {
            var cmdUrl = '/clearSessionData';
            return $http.get(cmdUrl).error(sendCmdFail);
        }

        function getStatusFailed(data) {
            logger.error('XHR Failed for getStatus.');
        }
        function getStatusSuccess(response) {
            logger.info('Successful getStatus');
            return response;
        }

        function restartPort() {
            var cmdUrl = '/restartPort';
            return $http.get(cmdUrl).error(sendCmdFail);
        }

        function sendCmd(whichCmd, args) {
            var cmdUrl = '/sendCommand/' + whichCmd + '/' + args;
            return $http.get(cmdUrl).error(sendCmdFail);
        }

        function sendCmdFail(data) {
            logger.error('XHR Failed for sendCommand.' + data);
        }

        function parseStatus(data) {
            var inData = JSON.deserialize(data);

        }

        function setAutoUpdates(enableUpdates) {
            autoUpdatesEnabled = enableUpdates;
        }

        function subscribe(func, type) {
            type = type || 'status'; // default to status
            if (typeof dataSubscribers[type] === 'undefined') {
                dataSubscribers[type] = [];
            }
            dataSubscribers[type].push(func);
        }

        function unsubscribe(func, type) {
            visitSubscribers('unsubscribe', func, type);
        }

        function emit(msg, type) {
            visitSubscribers('emit', msg, type);
        }

        function visitSubscribers(action, arg, type) {
            var emitType = type || 'status';
            var consumers = dataSubscribers[emitType];
            var i;
            for (i = 0; i < consumers.length; i += 1) {
                if (action === 'emit') {
                    consumers[i](arg);
                } else {
                    if (consumers[i] === arg) {
                        consumers.splice(i, 1);
                    }
                }

            }
        }





    }
}
)();