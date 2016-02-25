;(function () {
  "use strict";

  var SmsCtrl = /*@ngInject*/function ($scope, $state, $stateParams, Application, UserService, $translate,
                                         $ionicContentBanner) {
    $ionicNavBarDelegate.showBackButton(true);
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;


    });

    $scope.sms = function () {
      var number = '0833267925';
      var message = 'Emergency : Locate -The client';


      //CONFIGURATION
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          intent: 'INTENT'  // send SMS with the native android SMS messaging

        }
      };

      var success = function () { alert('Message sent successfully'); };
      var error = function (e) { alert('Message Failed:' + e); };
      sms.send(number, message, options, success, error);

    };

  }
  appModule('app.sms').controller('smsCtrl', SmsCtrl);
}());
