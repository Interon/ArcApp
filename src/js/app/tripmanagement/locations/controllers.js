


;(function() {
  "use strict";

  var MapCtrl = /*@ngInject*/function ($scope, $timeout, $cordovaGeolocation, uiGmapGoogleMapApi, $rootScope,$q,uiGmapIsReady,$ionicPopup) {

    $scope.mapControl = {};

    uiGmapIsReady.promise()
        .then(function(maps) {
          var mapControl = $scope.mapControl.getGMap();
         var placesService = new google.maps.places.PlacesService(mapControl);

        });

    uiGmapGoogleMapApi.then(function (maps) {
      $scope.map = { center: { latitude: $rootScope.country.lat, longitude: $rootScope.country.lon }, zoom: 15 };
             // Don't pass timeout parameter here; that is handled by setTimeout below
          var posOptions = {enableHighAccuracy: false};
          $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
              console.log("Got location: " + JSON.stringify(position));
              initializeMap(position);
          }, function(error) {
              console.log(error);
              initializeMap();
          });
      });
   $scope.search = function (ss)
   {
       var iam = new google.maps.LatLng($rootScope.country.lat, $rootScope.country.lon);
       var mapControl = $scope.mapControl.getGMap();
       var placesService = new google.maps.places.PlacesService(mapControl);
     var request = {
       location: iam,
       radius: '5000',
       query: [ss]
     };

     var d = $q.defer();
    placesService.textSearch(request, function(results, status) {
       if (status == 'OK') {

         d.resolve(results);
           addMarker(results);
       }
       else d.reject(status);
     });





   }


    $scope.markers = [];
    $scope.infoVisible = false;
    $scope.infoBusiness = {};

    // Initialize and show infoWindow for business
    $scope.showInfo = function(marker, eventName, markerModel) {

        var mapControl = $scope.mapControl.getGMap();
        var placesService = new google.maps.places.PlacesService(mapControl);
        placesService.getDetails({
            placeId: markerModel.place_id
        }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                debugger;
              $scope.Details = place;

            }
        });
      $scope.infoBusiness = markerModel;
      $scope.infoVisible = true;
    };

    // Hide infoWindow when 'x' is clicked
    $scope.hideInfo = function() {
      $scope.infoVisible = false;
    };

    var initializeMap = function(position) {
      console.log(position);
      if (!position) {
        // Default to downtown Toronto
        position = {
          coords: {
            latitude: $rootScope.country.lat,
            longitude: $rootScope.country.lon
          }
        };
      }
      console.log(position);
      // TODO add marker on current location

      $scope.map = {
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        zoom: 12
      };

      // Make info window for marker show up above marker
      $scope.windowOptions = {
        pixelOffset: {
          height: -32,
          width: 0
        }
      };



    };

       function setMapOnAll (map) {

      }

// Removes the markers from the map, but keeps them in the array.
      var clearMarkers = function() {
          this.setMapOnAll(null);
      }

// Shows any markers currently in the array.
      var showMarkers = function() {
          var mapControl = $scope.mapControl.getGMap();
          for (var i = 0; i < $scope.markers.length; i++) {


              $scope.markers[i].setMap(mapControl);
          }
      }

// Deletes all markers in the array by removing references to them.
     var  deleteMarkers = function() {
          this.clearMarkers();
         $scope.markers = [];
      }
     var  addMarker = function(res) {

         $scope.randomMarkers = [];
         // Get the bounds from the map once it's loaded
         $scope.$watch(function() {
             return $scope.map.bounds;
         }, function() {

                 var markers = [];
                 for(var i =0 ;i<res.length;i++) {

                     markers.push(createMarker(i,res[i]));
                 }

                 $scope.markers = markers;

         }, true);




      }

      var createMarker = function(i,res) {




          var ret = {
              title:  res.name,
              latitude: res.geometry.location.lat(),
              longitude: res.geometry.location.lng(),
              animation: google.maps.Animation.DROP,
              formatted_address:res.formatted_address,
              place_id:res.place_id,
              id:i

          };
          //ret[idKey] = res.id;;
          return ret;
      };
    // Deal with case where user does not make a selection
    $timeout(function() {
      if (!$scope.map) {
        console.log("No confirmation from user, using fallback");
        initializeMap();
      }
    }, 5000);






  };

  appModule('app.mainPage').controller('MapCtrl', MapCtrl);
}());





