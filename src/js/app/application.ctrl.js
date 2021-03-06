;(function() {
"use strict";

angular.module('app')

  //
  // This is the global top-level parent controller specified on the "body" tag in index.html, it wraps all other
  // controllers and can be used e.g. for shared callbacks/event handlers on any page; for explanation see:
  //
  // http://www.clearlyinnovative.com/ionic-framework-tabs-go-home-view/
  //
  .controller('ApplicationCtrl', function ($state, Application, UserService, $scope, $location,$ionicHistory) {

 $scope.myGoBack = function(number) {
    $ionicHistory.goBack(number);
  };
 $scope.goTo = function (hash) {
    console.log('goTo clicked - '+ hash);
  $state.go(hash);
 };
    // UTILITY FUNCTIONS
    $scope.goNext = function (hash) { 
  $state.go(hash, '' || {reload:true});
 }
    this.logout = function() {
      UserService.logout();
      $state.go('loggedout');
    };

    this.login = function() {
      $state.go('login');
    };

    this.isLoggedIn = function() {
      return Application.isUserLoggedIn();
    };

  })
;
}());
