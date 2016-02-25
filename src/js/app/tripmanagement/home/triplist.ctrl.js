;(function() {
"use strict";

var tripListCtrl = /*@ngInject*/function ($scope, $ionicSideMenuDelegate,loggingService,Application,$ionicNavBarDelegate,$state,Restangular,UserData,Server,$localstorage) {

    var userdata = $localstorage.getObject('user');
    $scope.showclient = true;

    $scope.goTo = function (hash) {
        console.log('goTo clicked - ' + hash);
        $state.go(hash);
    };
    $scope.$on('$ionicView.enter', function () {

        $ionicNavBarDelegate.showBar(true);

    });
    $scope.openRightSideMenu = function () {
        loggingService.log("triplist", "right button clicked");

        $ionicSideMenuDelegate.toggleRight();
    };

    var user = UserData.getData()[0];

    Application.showLoading(true);
    if (userdata.type = 'team'){
        $scope.showclient = false;
        Restangular.all('/trips-master/?descendants=TripDetails&resolvecontent=country&resolvemedia=buttonflag').getList()
            .then(function (data) {
                debugger;
                $scope.triplist = [];
                $scope.countries = [];
                $scope.opsText = [];
                $scope.opsImage = [];
                for(var i=0;i<data.length;i++)
                {

                    switch(data[i].class[0]) {
                        case 'TripDetails':
                            $scope.triplist.push(data[i]);
                            break;

                        case 'Country':
                            $scope.countries.push(data[i]);

                            break;
                        default:
                            break;
                    }




                }

                Application.hideLoading();
            });
}
    else
    {


    Restangular.all(user.properties.Url +'trip-management?children=true&resolvecontent=tripcountry&resolvemedia=buttonflag').getList()
        .then(function(data) {

            $scope.triplist = [];
            $scope.countries = [];
            $scope.opsText = [];
            $scope.opsImage = [];
            for(var i=0;i<data.length;i++)
            {

                switch(data[i].class[0]) {
                    case 'EmbeddedCkeditor':
                        $scope.opsText.push(data[i]);
                        break;
                    case 'EmbeddedImages':
                        $scope.opsImage.push(data[i]);
                        break;
                    case 'Trip':
                        $scope.triplist.push(data[i]);
                        break;
                    case 'Country':
                        $scope.countries.push(data[i]);

                        break;
                    default:
                        break;
                }




            }

            Application.hideLoading();


        });

    }



    $scope.url = Server.url;

};

appModule('app.mainPage').controller('tripListCtrl', tripListCtrl);
}());
