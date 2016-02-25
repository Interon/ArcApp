;(function() {
"use strict";

var secureDriveController = /*@ngInject*/function ($scope,$http) {  // user is injected through UI-router resolve on the abstract state 'auth'
    $scope.rate = 3;
    $scope.max = 5;
    $scope.store = {};

    $scope.store.products = [];


    $http.get('http://api.randomuser.me/?results=5&gender=male').success(function (data) {

        $scope.items = data.results;
    });

    $scope.CallTel = function (tel) {
        window.location.href = 'tel:' + tel;
    }
};

appModule('app.mainPage').controller('secureDriveController', secureDriveController);
}());