/// <reference path="../../3rdParty/script/angular.intellisense.js" />
/// <reference path="../../3rdParty/script/angular.js" />
// This file is for setting up basic configuratons
(function () {
    var basePortUrl = 'http://localhost:51887/SerialSwitch';

    angular.module('app')
        .value('basePortUrl', basePortUrl)
        .value('toastr', toastr);
       
}
)();