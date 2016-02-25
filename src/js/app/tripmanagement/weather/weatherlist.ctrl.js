/**
 * @license Ionic-Weather-Application
 * (c) 2015 Sascha Sambale, http://www.project-webdev.com
 * License: MIT
 */
(function () {
  'use strict';
  /**
   * @ngdoc module
   * @name weatherapp.weatherlist
   * @description
   *
   * The weatherapp.weatherlist module handles the display of the weather data cards.
   *
   **/
  angular.module('app.mainPage' )
  /**
   * @ngdoc controller
   * @name WeatherlistController
   * @requires $scope
   * @requires LocationService
   * @requires WeatherListFactory
   *
   * @description
   *
   * The `WeatherlistController` constructs an array of location/weather data, by sending the location to the OpenWeatherMap API and storing the result in a variable.
   *
   */
    .controller('WeatherlistController', ['$scope', 'LocationService', 'WeatherListFactory', WeatherlistController]);

  function WeatherlistController($scope,$rootScope, LocationService, WeatherListFactory) {
    $scope.$on('$ionicView.enter', function () {


    });
  }
})();