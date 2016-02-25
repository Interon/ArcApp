


;(function() {
"use strict";

var tripDetailsController = /*@ngInject*/function ($scope,$rootScope,$ionicPlatform, $ionicSideMenuDelegate,$firebaseObject,loggingService,Application,$ionicNavBarDelegate,$ionicPopup,$http,$stateParams,Server,UserData,Restangular,$cordovaEmailComposer,$ionicModal) {

    $scope.$on('$ionicView.enter', function () {

        $ionicNavBarDelegate.showBar(true);
    });
    $scope.reload = false;
    $scope.openRightSideMenu = function(){
        loggingService.log("triplist", "right button clicked");

        $ionicSideMenuDelegate.toggleRight();
    };
    Application.showLoading(true);
    $scope.teams = [];




    $rootScope.tripId = $stateParams.Id;
    Restangular.one('?currentmodel='+ $stateParams.Id+'&nocache=true').get()
        .then(function(data) {
            
            $scope.triplist = [];
            $scope.countries = [];
            $scope.ops = [];
            $scope.memberCountryDetails = [];
            $scope.tripdetails = data.properties;
            $scope.showops = false;
            if(data.entities !== undefined) {
                $scope.showops = true;
                if(data.entities) {

                for (var i = 0; i < data.entities.length; i++) {

                    switch (data.entities[i].class[0]) {
                        case 'EmbeddedCkeditor':
                            $scope.ops.push(data.entities[i]);
                            break;
                        case 'EmbeddedImages':
                            $scope.ops.push(data.entities[i]);
                            break;

                        //case 'Country':
                        //    $scope.countries.push(data[i]);
                        //    break;
                        //case 'Country':
                        //    $scope.countries.push(data[i]);
                        //    break;
                        default:
                            break;
                    }

                }
            }
            }

            Restangular.one('?currentmodel='+ $scope.tripdetails.tripcountry.value ).get()
                .then(function(country) {

                    console.log(country);
                    $scope.country = country;

                    $scope.showAlert = function () {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Country Alert',
                            template: country.properties.countryWarnings.value
                        });

                    };
                    Application.hideLoading();

                    if(country.properties.countryWarnings.value != "")
                    {
                        $scope.showAlert();
                    }

                });


            var _teams =$scope.tripdetails.tmtripTeam.value.split(',');
            for(var i=0;i<_teams.length;i++)
            {

                Restangular.one('?currentmodel='+ _teams[i] + '&resolvecontent=memberCountryVisiting').get()
                    .then(function(team) {
                        try {

                            if (team.entities.length > 0) {

                                for (var x =0; x<team.entities.length;x++) {
                                    switch (team.entities[x].class[0]) {
                                        case 'MemberCountryDetails':

                                            if($scope.country.properties.Id.value == team.entities[x].properties.memberCountryVisiting.value)
                                            {
                                                team.properties.tmContactNo.value = team.entities[x].properties.memberCountryContactNumber.value;
                                            }

                                            break;

                                        //case 'Country':
                                        //    $scope.countries.push(data[i]);
                                        //    break;
                                        //case 'Country':
                                        //    $scope.countries.push(data[i]);
                                        //    break;
                                        default:

                                            break;
                                    }
                                }
                            }
                        }
                        catch
                            (e)
                            {

                            }
                        debugger;
                        $scope.teams.push(team.properties);

                    });

            }



            

            Restangular.one('?currentmodel='+ $scope.tripdetails.tripcountry.value + '&descendants=ContactNumber').get()
                .then(function(contactnos) {

                $scope.contactnos = contactnos.entities;



                });

            
            Restangular.all('?currentmodel='+ $scope.tripdetails.tripcountry.value +'?descendants=GeneralInfo' ).getList()
                .then(function(GeneralInfo) {
                    console.log('GeneralInfo->'+GeneralInfo);
                    $scope.GeneralInfo = GeneralInfo;



                });

        });


        $scope.url = Server.url;

    $scope.flightStatus = function(fnumber,date) {
              var a = fnumber.spit(' ');
        var date_test = new Date("2011-07-14 11:23:00".replace(/-/g,"/"));
        var thedate = new Date(Date.parse(date_test));
        Restangular.oneUrl('/flex/flightstatus/rest/v2/json/flight/status/' + airline + '/' + no +'/dep/'+thedate +'/?appId=ae9e66d6&appKey=6f5d2b87e43c9b7af14706ed92c920cb&utc=true', 'https://api.flightstats.com' ).get()

            .then(function(data) {
               return data;
            });


    };

    $scope.sendSMS = function() {

        Restangular.oneUrl('/eapi/submission/send_sms/2/2.0?username=qz2rg4&password=Access99&message='+$scope.body+'&msisdn=27833267925', 'http://bulksms.2way.co.za' ).get()

            .then(function(sms) {
                debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Thank you',
                    template: 'A message has been sent Status: ->' + sms
                });
            });


    };

    $scope.showhtml = false;
    $scope.showimages = false;

    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    })
    $scope.openModal = function(data) {

        for(var i = 0 ;i<$scope.ops.length;i++)
        {
            if($scope.ops[i].title == data) {
                if ($scope.ops[i].properties.embcontent) {
                    $scope.html = $scope.ops[i].properties.embcontent.value;
                    $scope.showhtml = true;
                    $scope.showimages  = false;
                }
                if ($scope.ops[i].properties.embimages) {
                    try {
                        $scope.images = $scope.ops[i].properties.embimages.value.split(',');
                    }
                    catch (e)
                    {$scope.images = $scope.ops[i].properties.embimages.value;}
                    $scope.showimages  = true;
                    $scope.showhtml = false;
                    Restangular.one('umbraco/api/media/GetMediaFromArray?array=' + $scope.images ).get()

                        .then(function(immagearray) {

                            $scope.immagearray = immagearray;
                        });
                }
            }
        }

        $scope.modal.show()
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

















    $ionicModal.fromTemplateUrl('profile-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal2) {
        $scope.modal2 = modal2
    })
    $scope.openModal2 = function( t) {

        $scope.tmprofile = t.tmprofile.value;
        $scope.modal2.show()
    }

    $scope.closeModal2 = function() {
        $scope.modal2.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal2.remove();
    });




    $ionicModal.fromTemplateUrl('flightstats-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modalFlightStats) {
        $scope.modalFlightStats = modalFlightStats
    })
    $scope.openModalFlightStats = function(data) {

        $scope.flightstats = flightStatus(fnumebr,date)

        $scope.modalFlightStats.show()
    }

    $scope.closeFlightStats = function() {
        $scope.modalFlightStats.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modalFlightStats.remove();
    });




};

appModule('app.mainPage').controller('tripDetailsController', tripDetailsController);
}());

