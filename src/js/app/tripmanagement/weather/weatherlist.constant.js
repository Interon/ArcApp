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
  angular.module('app.mainPage')
  /**
   * @ngdoc constant
   * @name WEATHER_API_URL
   * @description
   *
   * The URL to the OpenWeatherMap API.
   *
   */
    .constant('WEATHER_API_URL', 'http://api.openweathermap.org/data/2.5/weather/?APPID=9e1f4c3abafa11b7fd98d040ec3ed0e7&units=metric&')
  /**
   * @ngdoc constant
   * @name WEATHER_API_IMAGE_URL
   * @description
   *
   * The URL to the images used by OpenWeatherMap API.
   *
   */
    .constant('WEATHER_API_IMAGE_URL', 'http://openweathermap.org/img/w/');
})();
