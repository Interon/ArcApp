;(function() {
"use strict";

var AdminCtrl = /*@ngInject*/function (Application, $scope, $ionicNavBarDelegate, $state, $ionicHistory, loggingService) {  // user is injected through UI-router resolve on the abstract state 'auth'
   $ionicNavBarDelegate.showBackButton(true);
   $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    Application.setInitialRun(true);
  
   });

   $scope.reset = function () {
       alert('Application Clean');
       loggingService.log("Admin#Reset", "");
       Application.setInitialRun(true);
       Application.gotoIntroPage($state);
   };

};

appModule('app.mainPage').controller('AdminCtrl', AdminCtrl);
}());