;(function() {
"use strict";

var opstripListCtrl = /*@ngInject*/function ($scope, $ionicSideMenuDelegate,loggingService,Application,$ionicNavBarDelegate,$state,Restangular,UserData,Server,$localstorage) {
    if (!String.prototype.includes) {
        String.prototype.includes = function() {'use strict';
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }
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

    $scope.doRefresh = function() {
        console.log('refresh');
        $state.reload();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };
    Application.showLoading(true);

    if (userdata.type = 'team'){
        $scope.showclient = false;
        Restangular.all('/trips-master/?descendants=TripDetails&resolvecontent=country&resolvemedia=buttonflag').getList()
            .then(function (data) {

                $scope.triplist = [];
                $scope.countries = [];
                $scope.opsText = [];
                $scope.opsImage = [];
                for(var i=0;i<data.length;i++)
                {

                    switch(data[i].class[0]) {
                        case 'TripDetails':
                            try{

                                var a =   data[i].properties.clientTeamContactInfo.value.split(',');
                                var b =  data[i].properties.securityTeam.value.split(',');
                                if(  a.indexOf(userdata.id.toString())   >= 0 ||b.indexOf(userdata.id.toString())  >= 0) {
                                    $scope.triplist.push(data[i]);
                                } else
                                {
                                    if (data[i].properties.clientTeamContactInfo.value == userdata.id ||data[i].properties.securityTeam.value == userdata.id) {
                                        $scope.triplist.push(data[i]);
                                    }
                                }
                            }
                            catch(err)
                            {
                                if(data[i].properties.clientTeamContactInfo.value == userdata.id ||data[i].properties.securityTeam.value == userdata.id){
                                    $scope.triplist.push(data[i]);
                                }
                            }
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

appModule('app.mainPage').controller('opstripListCtrl', opstripListCtrl);
}());
