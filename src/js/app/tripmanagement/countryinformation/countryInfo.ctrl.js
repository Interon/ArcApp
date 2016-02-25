
 appModule('app.mainPage').controller("countryInfoController", function($scope,$state, $stateParams,$rootScope,Restangular,Server,$sce) {
     $scope.w =  window.screen.width;
     $scope.h = window.screen.height;

     if ($scope.w > 1000) {$scope.w =350;}

     $scope.url = Server.url;
     $scope.country = $rootScope.country;

     var url = $scope.country.url;
     Restangular.one(url +'?encodeHTML=false' ).get()
         .then(function(data) {

             $scope.ContactNumbers =[];
             $scope.ci = data;
             $scope.countryInfo = $sce.trustAsResourceUrl($scope.ci.properties.countryInfo.value);
             var html = $scope.ci.properties.countryPointsOfInterest.value.replace(/src="\/media\//g,"src=\"http://arcapp.interon.co.za/media/");
             $scope.poi =    html;

         });


 });