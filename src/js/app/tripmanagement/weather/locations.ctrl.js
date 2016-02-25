/**
 * @license Ionic-Weather-Application
 * (c) 2015 Sascha Sambale, http://www.project-webdev.com
 * License: MIT
 */
(function () {
  'use strict';
  /**
   * @ngdoc module
   * @name weatherapp.locations
   * @requires weatherapp.weatherlist
   * @description
   *
   * The weatherapp.locations module provides all necessary components for the 'Locations' screen of the application.
   *
   * You can add a new location by just typing the name or by using GPS. You can also remove locations that you don't need anymore.
   *
   **/
  angular.module('app.mainPage')
  /**
   * @ngdoc controller
   * @name LocationsCtrl
   * @requires $scope
   * @requires $q
   * @requires $ionicPopup
   * @requires LocationService
   * @requires WeatherListFactory
   * @requires WEATHER_API_URL
   * @description
   *
   * The `LocationsController` handles the addition and removal of locations. It uses the {@link LocationService `LocationService`} to actually access the device storage (to store the locations) and to retrieve data from the OpenWeatherMap-API.
   *
   */
    .controller('LocationsController', ['$scope', '$q', '$ionicPopup', 'LocationService', 'WeatherListFactory', 'WEATHER_API_URL','$rootScope','$state', LocationsController]);

  function LocationsController($scope, $q, $ionicPopup, LocationService, WeatherListFactory, WEATHER_API_URL,$rootScope,$state) {

    $scope.$on('$ionicView.enter', function () {

    load();
    });


    function load()

    {

      $scope.Id =0;
      // whenever the Locations view is shown - empty location model and reload the current list of locations.





      //from weatherlistcontroller
      $scope.tb = '';
      $scope.Id = $rootScope.tripId;
      $scope.locationData = [];
      $scope.errorLocationRetrieval = false;
      LocationService.test();
      var locations = LocationService.getLocations();
      $scope.locations = locations;

      $scope.noLocation = locations.length < 1;
      // only display locations when there are some
      if (!$scope.noLocation) {
        // iterate through the stored locations and call the OpenWeatherMap REST API
        locations.forEach(function (location) {
          WeatherListFactory.getWeatherData(location).then(function (response) {
            WeatherListFactory.updateWeatherIcon(response.data).then(function (locationWeather) {
              // store the result in our array, which will be displayed in the view
              $scope.locationData.push(locationWeather);
            });
          }, function () {
            // show error message on screen
            $scope.errorLocationRetrieval = true;
          });
        });
      }

    }



    // removes the given location
    $scope.removeLocation = function (location) {
      $scope.tb = '';
      $scope.locations = LocationService.removeLocation(location);
    load();
    };

    // adds a given location to the storage
    $scope.addLocation = function (location) {
      // validates the location before adding it
      validateLocation(location).then(function () {
        $scope.tb = '';
        $scope.locations = LocationService.addLocation(location.trim());
        load();
      }, function () {
        showError('Error adding location!', 'The location you have entered is either not valid or you don\'t have access to the internet (e.g. firewall access) in order to verify the given location.');
      });
    };

    // retrieves the current location from the device (by using its GPS service)
    $scope.getCurrentLocation = function () {


      $scope.showSpinner = true;
      LocationService.getCurrentLocation().then(function (location) {

        $scope.showSpinner = false;
        $scope.tb = location;

      }, function () {
        $scope.showSpinner = false;
        showError('Error retrieving current location!', 'Your location could not be retrieved. Please make sure you have your GPS Location Services enabled and your network allows the retrieval.');
      });

    };

    /**
     * Shows an error dialog with a given title and text.
     * @param {string} title The title of the dialog
     * @param {string} text The text to be shown in the dialog
     */
    function showError(title, text) {
      $ionicPopup.alert({
        title: title,
        template: text
      });
    }

    /**
     * Validates any given location by first matching it against a simple regular expression and then by trying to retrieve it from the OpenWeatherMap API.
     * @param {string} location The location to validate
     */
    function validateLocation(location) {
      // use a promise to check whether the city is valid or not
      return $q(function (resolve, reject) {
        //very simple pre-validation, so we don't stress the web service unnecessarily
        var myRegExp = /[a-zA-Z]+(?:(?:\\s+|-)[a-zA-Z]+)*/;
        // check if the city matches our regular expression
        if (location && location.match(myRegExp)) {
          // location matched our Regex... let's test it against the web service directly
          WeatherListFactory.getWeatherData(WEATHER_API_URL + 'q=' + location).then(function (response) {
            //noinspection JSUnresolvedVariable
            if (!response.data || response.data.cod === '404') {
              // web service returned error code, so city is not valid
              reject();
            } else {
              // the city is valid, everything is cool.
              resolve();
            }
          }, function () {
            reject();
          });
        } else {
          // looks like the city is not a valid city
          reject();
        }
      });
    }
  }
})();