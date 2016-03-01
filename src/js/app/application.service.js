;(function () {
  "use strict";

  angular.module('app')
      .factory('$localstorage', ['$window', function($window) {
          return {
              set: function(key, value) {
                  $window.localStorage[key] = value;
              },
              get: function(key, defaultValue) {
                  return $window.localStorage[key] || defaultValue;
              },
              setObject: function(key, value) {
                  $window.localStorage[key] = JSON.stringify(value);
              },
              getObject: function(key) {
                  return JSON.parse($window.localStorage[key] || '{}');
              }
          }}])
      .factory('Yelp', function($http, $q, apiUrl) {
          return {
              search: function(position) {
                  return $http({
                      method: "get",
                      url: apiUrl + 'api/v1/yelp/search',
                      params: {
                          limit: 10,
                          radius_filter: 500,
                          sort: 1,
                          ll: [position.coords.latitude, position.coords.longitude].join()
                      }
                  });
              }
          }})
      .service('Map', function($q,$rootScope,$ionicPopup,$ionicPlatform) {
          $ionicPlatform.ready(function () {

              var iam = new plugin.google.maps.LatLng($rootScope.country.lat, $rootScope.country.lon);
              var options = {

                  center: new plugin.google.maps.LatLng($rootScope.country.lat, $rootScope.country.lon),
                  zoom: 13,
                  disableDefaultUI: true,
                  styles: [{
                      stylers: [{ visibility: 'simplified' }]
                  }, {
                      elementType: 'labels',
                      stylers: [{ visibility: 'off' }]
                  }]
              }

              var div = document.getElementById("map_canvas");
              var map = plugin.google.maps.Map.getMap(div);
             // this.places = new google.maps.places.PlacesService(map);
          });

          //var iam  = new google.maps.LatLng($rootScope.country.lat, $rootScope.country.lon);
          //var infowindow = new google.maps.InfoWindow();


          var markers = [];
        this.init = function() {


        }

        this.search = function(str) {

            this.deleteMarkers();
            var request = {
                location: iam,
                radius: '5000',
                query: [str]
            };

            var d = $q.defer();
            this.places.textSearch(request, function(results, status) {
                if (status == 'OK') {
                    d.resolve(results);
                }
                else d.reject(status);
            });
            return d.promise;
            this.showMarkers()
        }

        this.addMarker = function(res) {

            for(var i =0 ;i<res.length;i++) {

                var marker = new plugin.google.maps.Marker({
                    map: this.map,
                    position: res[i].geometry.location,
                    animation: plugin.google.maps.Animation.DROP
                });
                var r = res[i];
                google.maps.event.addListener(marker, 'click', function(r) {
                    debugger;
                    var alertPopup = $ionicPopup.alert({
                        title: r.name,
                        template: r.formatted_address
                    });

                });
                markers.push(marker);
            }
            this.map.setCenter(iam);
        }
          this.setMapOnAll = function(map) {
              for (var i = 0; i < markers.length; i++) {
                  markers[i].setMap(map);
              }
          }

// Removes the markers from the map, but keeps them in the array.
          this.clearMarkers = function() {
              this.setMapOnAll(null);
          }

// Shows any markers currently in the array.
          this.showMarkers = function() {
              this.setMapOnAll(map);
          }

// Deletes all markers in the array by removing references to them.
          this.deleteMarkers = function() {
              this.clearMarkers();
              markers = [];
          }

    })
    //
    // This service provides a set of convenience/utility methods that you can use throughout your app.
    //
    .factory('Application', function (LocalStorage, UserService, Tracking, APP, $log, loggingService, $ionicHistory,
                                      $ionicLoading) {

      var init = function () {
    
        loggingService.log("Application#init", "start");

        UserService.init();
        Tracking.initUser(UserService.currentUser());

        loggingService.log("Application#init", "end");
      };

      var getStartPage = function () {
        var state = null;

        //
        // "initial page" logic - this determines the first page to be shown by the app.
        //
        // This way, we can guide the user through the onboarding process.
        //

        if (isInitialRun()) {
          state = 'login';
        } else if (!isUserRegistered()) {
          state = 'login';
        } else if (!isUserLoggedIn()) {
          state = 'login';
        } else {
          state = APP.routerDefaultState;
        }

        loggingService.log(
          "Application#getStartPage", "state = " + state);

        return {state: state, stateParams: null};
      };



      var  countries =  [
          { name: 'Afghanistan', code: 'AF' },
          { name: 'Åland Islands', code: 'AX' },
          { name: 'Albania', code: 'AL' },
          { name: 'Algeria', code: 'DZ' },
          { name: 'American Samoa', code: 'AS' },
          { name: 'Andorra', code: 'AD' },
          { name: 'Angola', code: 'AO' },
          { name: 'Anguilla', code: 'AI' },
          { name: 'Antarctica', code: 'AQ' },
          { name: 'Antigua and Barbuda', code: 'AG' },
          { name: 'Argentina', code: 'AR' },
          { name: 'Armenia', code: 'AM' },
          { name: 'Aruba', code: 'AW' },
          { name: 'Australia', code: 'AU' },
          { name: 'Austria', code: 'AT' },
          { name: 'Azerbaijan', code: 'AZ' },
          { name: 'Bahamas', code: 'BS' },
          { name: 'Bahrain', code: 'BH' },
          { name: 'Bangladesh', code: 'BD' },
          { name: 'Barbados', code: 'BB' },
          { name: 'Belarus', code: 'BY' },
          { name: 'Belgium', code: 'BE' },
          { name: 'Belize', code: 'BZ' },
          { name: 'Benin', code: 'BJ' },
          { name: 'Bermuda', code: 'BM' },
          { name: 'Bhutan', code: 'BT' },
          { name: 'Bolivia', code: 'BO' },
          { name: 'Bosnia and Herzegovina', code: 'BA' },
          { name: 'Botswana', code: 'BW' },
          { name: 'Bouvet Island', code: 'BV' },
          { name: 'Brazil', code: 'BR' },
          { name: 'British Indian Ocean Territory', code: 'IO' },
          { name: 'Brunei Darussalam', code: 'BN' },
          { name: 'Bulgaria', code: 'BG' },
          { name: 'Burkina Faso', code: 'BF' },
          { name: 'Burundi', code: 'BI' },
          { name: 'Cambodia', code: 'KH' },
          { name: 'Cameroon', code: 'CM' },
          { name: 'Canada', code: 'CA' },
          { name: 'Cape Verde', code: 'CV' },
          { name: 'Cayman Islands', code: 'KY' },
          { name: 'Central African Republic', code: 'CF' },
          { name: 'Chad', code: 'TD' },
          { name: 'Chile', code: 'CL' },
          { name: 'China', code: 'CN' },
          { name: 'Christmas Island', code: 'CX' },
          { name: 'Cocos (Keeling) Islands', code: 'CC' },
          { name: 'Colombia', code: 'CO' },
          { name: 'Comoros', code: 'KM' },
          { name: 'Congo', code: 'CG' },
          { name: 'Congo, The Democratic Republic of the', code: 'CD' },
          { name: 'Cook Islands', code: 'CK' },
          { name: 'Costa Rica', code: 'CR' },
          { name: 'Cote D\'Ivoire', code: 'CI' },
          { name: 'Croatia', code: 'HR' },
          { name: 'Cuba', code: 'CU' },
          { name: 'Cyprus', code: 'CY' },
          { name: 'Czech Republic', code: 'CZ' },
          { name: 'Denmark', code: 'DK' },
          { name: 'Djibouti', code: 'DJ' },
          { name: 'Dominica', code: 'DM' },
          { name: 'Dominican Republic', code: 'DO' },
          { name: 'Ecuador', code: 'EC' },
          { name: 'Egypt', code: 'EG' },
          { name: 'El Salvador', code: 'SV' },
          { name: 'Equatorial Guinea', code: 'GQ' },
          { name: 'Eritrea', code: 'ER' },
          { name: 'Estonia', code: 'EE' },
          { name: 'Ethiopia', code: 'ET' },
          { name: 'Falkland Islands (Malvinas)', code: 'FK' },
          { name: 'Faroe Islands', code: 'FO' },
          { name: 'Fiji', code: 'FJ' },
          { name: 'Finland', code: 'FI' },
          { name: 'France', code: 'FR' },
          { name: 'French Guiana', code: 'GF' },
          { name: 'French Polynesia', code: 'PF' },
          { name: 'French Southern Territories', code: 'TF' },
          { name: 'Gabon', code: 'GA' },
          { name: 'Gambia', code: 'GM' },
          { name: 'Georgia', code: 'GE' },
          { name: 'Germany', code: 'DE' },
          { name: 'Ghana', code: 'GH' },
          { name: 'Gibraltar', code: 'GI' },
          { name: 'Greece', code: 'GR' },
          { name: 'Greenland', code: 'GL' },
          { name: 'Grenada', code: 'GD' },
          { name: 'Guadeloupe', code: 'GP' },
          { name: 'Guam', code: 'GU' },
          { name: 'Guatemala', code: 'GT' },
          { name: 'Guernsey', code: 'GG' },
          { name: 'Guinea', code: 'GN' },
          { name: 'Guinea-Bissau', code: 'GW' },
          { name: 'Guyana', code: 'GY' },
          { name: 'Haiti', code: 'HT' },
          { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
          { name: 'Holy See (Vatican City State)', code: 'VA' },
          { name: 'Honduras', code: 'HN' },
          { name: 'Hong Kong', code: 'HK' },
          { name: 'Hungary', code: 'HU' },
          { name: 'Iceland', code: 'IS' },
          { name: 'India', code: 'IN' },
          { name: 'Indonesia', code: 'ID' },
          { name: 'Iran, Islamic Republic Of', code: 'IR' },
          { name: 'Iraq', code: 'IQ' },
          { name: 'Ireland', code: 'IE' },
          { name: 'Isle of Man', code: 'IM' },
          { name: 'Israel', code: 'IL' },
          { name: 'Italy', code: 'IT' },
          { name: 'Jamaica', code: 'JM' },
          { name: 'Japan', code: 'JP' },
          { name: 'Jersey', code: 'JE' },
          { name: 'Jordan', code: 'JO' },
          { name: 'Kazakhstan', code: 'KZ' },
          { name: 'Kenya', code: 'KE' },
          { name: 'Kiribati', code: 'KI' },
          { name: 'Democratic People\'s Republic of Korea', code: 'KP' },
          { name: 'Korea, Republic of', code: 'KR' },
          { name: 'Kosovo', code: 'XK' },
          { name: 'Kuwait', code: 'KW' },
          { name: 'Kyrgyzstan', code: 'KG' },
          { name: 'Lao People\'s Democratic Republic', code: 'LA' },
          { name: 'Latvia', code: 'LV' },
          { name: 'Lebanon', code: 'LB' },
          { name: 'Lesotho', code: 'LS' },
          { name: 'Liberia', code: 'LR' },
          { name: 'Libyan Arab Jamahiriya', code: 'LY' },
          { name: 'Liechtenstein', code: 'LI' },
          { name: 'Lithuania', code: 'LT' },
          { name: 'Luxembourg', code: 'LU' },
          { name: 'Macao', code: 'MO' },
          { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
          { name: 'Madagascar', code: 'MG' },
          { name: 'Malawi', code: 'MW' },
          { name: 'Malaysia', code: 'MY' },
          { name: 'Maldives', code: 'MV' },
          { name: 'Mali', code: 'ML' },
          { name: 'Malta', code: 'MT' },
          { name: 'Marshall Islands', code: 'MH' },
          { name: 'Martinique', code: 'MQ' },
          { name: 'Mauritania', code: 'MR' },
          { name: 'Mauritius', code: 'MU' },
          { name: 'Mayotte', code: 'YT' },
          { name: 'Mexico', code: 'MX' },
          { name: 'Micronesia, Federated States of', code: 'FM' },
          { name: 'Moldova, Republic of', code: 'MD' },
          { name: 'Monaco', code: 'MC' },
          { name: 'Mongolia', code: 'MN' },
          { name: 'Montenegro', code: 'ME' },
          { name: 'Montserrat', code: 'MS' },
          { name: 'Morocco', code: 'MA' },
          { name: 'Mozambique', code: 'MZ' },
          { name: 'Myanmar', code: 'MM' },
          { name: 'Namibia', code: 'NA' },
          { name: 'Nauru', code: 'NR' },
          { name: 'Nepal', code: 'NP' },
          { name: 'Netherlands', code: 'NL' },
          { name: 'Netherlands Antilles', code: 'AN' },
          { name: 'New Caledonia', code: 'NC' },
          { name: 'New Zealand', code: 'NZ' },
          { name: 'Nicaragua', code: 'NI' },
          { name: 'Niger', code: 'NE' },
          { name: 'Nigeria', code: 'NG' },
          { name: 'Niue', code: 'NU' },
          { name: 'Norfolk Island', code: 'NF' },
          { name: 'Northern Mariana Islands', code: 'MP' },
          { name: 'Norway', code: 'NO' },
          { name: 'Oman', code: 'OM' },
          { name: 'Pakistan', code: 'PK' },
          { name: 'Palau', code: 'PW' },
          { name: 'Palestinian Territory, Occupied', code: 'PS' },
          { name: 'Panama', code: 'PA' },
          { name: 'Papua New Guinea', code: 'PG' },
          { name: 'Paraguay', code: 'PY' },
          { name: 'Peru', code: 'PE' },
          { name: 'Philippines', code: 'PH' },
          { name: 'Pitcairn', code: 'PN' },
          { name: 'Poland', code: 'PL' },
          { name: 'Portugal', code: 'PT' },
          { name: 'Puerto Rico', code: 'PR' },
          { name: 'Qatar', code: 'QA' },
          { name: 'Reunion', code: 'RE' },
          { name: 'Romania', code: 'RO' },
          { name: 'Russian Federation', code: 'RU' },
          { name: 'Rwanda', code: 'RW' },
          { name: 'Saint Helena', code: 'SH' },
          { name: 'Saint Kitts and Nevis', code: 'KN' },
          { name: 'Saint Lucia', code: 'LC' },
          { name: 'Saint Pierre and Miquelon', code: 'PM' },
          { name: 'Saint Vincent and the Grenadines', code: 'VC' },
          { name: 'Samoa', code: 'WS' },
          { name: 'San Marino', code: 'SM' },
          { name: 'Sao Tome and Principe', code: 'ST' },
          { name: 'Saudi Arabia', code: 'SA' },
          { name: 'Senegal', code: 'SN' },
          { name: 'Serbia', code: 'RS' },
          { name: 'Seychelles', code: 'SC' },
          { name: 'Sierra Leone', code: 'SL' },
          { name: 'Singapore', code: 'SG' },
          { name: 'Slovakia', code: 'SK' },
          { name: 'Slovenia', code: 'SI' },
          { name: 'Solomon Islands', code: 'SB' },
          { name: 'Somalia', code: 'SO' },
          { name: 'South Africa', code: 'ZA' },
          { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
          { name: 'Spain', code: 'ES' },
          { name: 'Sri Lanka', code: 'LK' },
          { name: 'Sudan', code: 'SD' },
          { name: 'Suriname', code: 'SR' },
          { name: 'Svalbard and Jan Mayen', code: 'SJ' },
          { name: 'Swaziland', code: 'SZ' },
          { name: 'Sweden', code: 'SE' },
          { name: 'Switzerland', code: 'CH' },
          { name: 'Syrian Arab Republic', code: 'SY' },
          { name: 'Taiwan', code: 'TW' },
          { name: 'Tajikistan', code: 'TJ' },
          { name: 'Tanzania, United Republic of', code: 'TZ' },
          { name: 'Thailand', code: 'TH' },
          { name: 'Timor-Leste', code: 'TL' },
          { name: 'Togo', code: 'TG' },
          { name: 'Tokelau', code: 'TK' },
          { name: 'Tonga', code: 'TO' },
          { name: 'Trinidad and Tobago', code: 'TT' },
          { name: 'Tunisia', code: 'TN' },
          { name: 'Turkey', code: 'TR' },
          { name: 'Turkmenistan', code: 'TM' },
          { name: 'Turks and Caicos Islands', code: 'TC' },
          { name: 'Tuvalu', code: 'TV' },
          { name: 'Uganda', code: 'UG' },
          { name: 'Ukraine', code: 'UA' },
          { name: 'United Arab Emirates', code: 'AE' },
          { name: 'United Kingdom', code: 'GB' },
          { name: 'United States', code: 'US' },
          { name: 'United States Minor Outlying Islands', code: 'UM' },
          { name: 'Uruguay', code: 'UY' },
          { name: 'Uzbekistan', code: 'UZ' },
          { name: 'Vanuatu', code: 'VU' },
          { name: 'Venezuela', code: 'VE' },
          { name: 'Viet Nam', code: 'VN' },
          { name: 'Virgin Islands, British', code: 'VG' },
          { name: 'Virgin Islands, U.S.', code: 'VI' },
          { name: 'Wallis and Futuna', code: 'WF' },
          { name: 'Western Sahara', code: 'EH' },
          { name: 'Yemen', code: 'YE' },
          { name: 'Zambia', code: 'ZM' },
          { name: 'Zimbabwe', code: 'ZW' }
      ];


      var gotoPage = function ($state, page, params, disableBackbutton, clearHistory) {

        // workaround for undesirable behavior when Ionic is showing the back button when we don't want it to
        if (disableBackbutton) {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
        }

        if (clearHistory) {
          $ionicHistory.clearHistory();
        }

        $state.go(page, params || {});
      };

      var gotoIntroPage = function ($state) {
        gotoPage($state, "app.intro", null, true);
      };

      var gotoStartPage = function ($state, clearHistory) {
        var page = getStartPage();

        // After redirecting the user to the start page we want to make sure we don't show a back-button.
        // This is why we preemptively clear the Ionic view history.
        gotoPage($state, page.state, page.stateParams, true, clearHistory);
      };

      var isInitialRun = function () {
        return LocalStorage.get("initialRun", "false") == "false";
      };

      var setInitialRun = function (initial) {
        LocalStorage.set("initialRun", initial ? "false" : "false");
      };

      var isUserRegistered = function () {
        return LocalStorage.get("userRegistered", "false") == "true";
      };

      var setUserRegistered = function (registered) {
        LocalStorage.set("userRegistered", registered ? "true" : "false");
      };

      var isUserLoggedIn = function () {
        return UserService.currentUser() !== null;
      };

      var showLoading = function (showBackdrop) {
        $ionicLoading.show({
          content: '',
          animation: 'fade-in',
          showBackdrop: showBackdrop,
          maxWidth: 200,
          showDelay: 0
        });
      };

      var hideLoading = function () {
        $ionicLoading.hide();
      };

      var resetForm = function (vm) {
        vm.form.$setPristine();
        vm.error = {};
      };

      var getLogger = function (context) {
        return $log.getLogger(context);
      };
        var url = function (context) {
            return 'arcapp.interon.co.za';
        };
      return {
        init: init,
        isInitialRun: isInitialRun,
        setInitialRun: setInitialRun,
        isUserRegistered: isUserRegistered,
        setUserRegistered: setUserRegistered,
        isUserLoggedIn: isUserLoggedIn,
        gotoPage: gotoPage,
        gotoStartPage: gotoStartPage,
        gotoIntroPage: gotoIntroPage,
        showLoading: showLoading,
        hideLoading: hideLoading,
        resetForm: resetForm,
        getLogger: getLogger,
          countries:countries,
        url  :url
      };
    });
}());
