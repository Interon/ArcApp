;(function() {
"use strict";

var DemoCtrl = /*@ngInject*/function (Application, $scope, $http,UserService,$state,$ionicPopup,Restangular,UserData) {  // user is injected through UI-router resolve on the abstract state 'auth'
    if (!Application.isUserLoggedIn()) {
        $state.go('login');
    }

    try {
        var user = UserData.getData()[0];




    Restangular.all(user.properties.Url + '?children=true').getList()
        .then(function (data) {

            $scope.securedrive =false;
            $scope.tripmanagement =false;

            for (var i = 0; i < data.length; i++) {

                switch (data[i].class[0]) {
                    case 'SecureDriveList':
                        $scope.securedrive = true;
                        break;
                    case 'TripManagementList':
                        $scope.tripmanagement =true;
                        break;

                    default:
                        break;
                }


            }
        });
}
    catch(e){
        return;
    }
    $scope.showAlert = function() {

        Restangular.oneUrl('/eapi/submission/send_sms/2/2.0?username=qz2rg4&password=Access99&message=ArcApp&msisdn=27833267925', 'http://bulksms.2way.co.za' ).get()

            .then(function(sms) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'An Emergency message has been sent'
                });
            });


    };


};

appModule('app.mainPage').controller('DemoCtrl', DemoCtrl);
}());