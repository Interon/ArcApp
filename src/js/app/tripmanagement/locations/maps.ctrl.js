

 appModule('app.mainPage').controller("mapsController", function($scope,$rootScope,$ionicPlatform) {



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

     $scope.w =  window.screen.width;
     $scope.h = window.screen.height;

     if ($scope.w > 1000) {$scope.w =370;$scope.h =200;}

     //$scope.search = function(searchPlace) {
     //    $scope.apiError = false;
     //    Map.search(searchPlace)
     //        .then(
     //            function(res) { // success
     //                Map.addMarker(res);
     //                $scope.place.name = res.name;
     //                $scope.place.lat = res.geometry.location.lat();
     //                $scope.place.lng = res.geometry.location.lng();
     //            },
     //            function(status) { // error
     //                $scope.apiError = true;
     //                $scope.apiStatus = status;
     //            }
     //        );
     //}

     $scope.send = function() {
         alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);
     }







});




