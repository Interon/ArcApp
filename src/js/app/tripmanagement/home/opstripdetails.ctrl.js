


;(function() {
"use strict";

var opstripDetailsController = /*@ngInject*/function ($scope,$rootScope,$ionicPlatform, $ionicSideMenuDelegate,$firebaseObject,loggingService,Application,$ionicNavBarDelegate,$ionicPopup,$http,$stateParams,Server,UserData,Restangular,$cordovaEmailComposer,$ionicModal,$sce,$ionicTabsDelegate, $interval,$localstorage) {
    if (!String.prototype.includes) {
        String.prototype.includes = function() {'use strict';
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }

    var  eventSource =null;
    $scope.$on('$ionicView.enter', function () {

        $ionicNavBarDelegate.showBar(true);
    });
    $scope.w =  window.screen.width;
    $scope.h = window.screen.height;

    var userdata = $localstorage.getObject('user');
    $scope.modalFlightStats =null;
    if ($scope.w > 1000) {$scope.w =350;}
    $scope.hw = ';height:'+$scope.h+'px'+';width:'+ $scope.w + 'px';
    $scope.showSurvey= true;
    $scope.showNews =false;
    $scope.showTripAlerts =false;
    $scope.reload = false;
    //$scope.openRightSideMenu = function(){
    //    loggingService.log("triplist", "right button clicked");
    //
    //    $ionicSideMenuDelegate.toggleRight();
    //};
    Application.showLoading(true);
    $scope.teams = [];
    $scope.oteams = [];
    $scope.vteams = [];
    $scope.showflighttab = false;
$scope.body;
    function splitor (s)
    {

        if (s != '')
        {
            try
            {
                   return s.split(',');
            }
            catch(e)
            {
                var ss = Array();
                 ss.push(s);
                return ss;
            }

        }
    }
    $rootScope.tripId = $stateParams.Id;
    Restangular.one('?currentmodel='+ $stateParams.Id+'&nocache=true&resolvecontent=country,tripOperationalPlan').get()
        .then(function(data) {

            $scope.triplist = [];
            $scope.countries = [];
            $scope.ops = [];
            $scope.memberCountryDetails = [];
            $scope.tripdetails = data.properties;
            $scope.flightstatsurl = "";
            $scope.showops = false;
            $scope.contactnos = [];
            $scope.flightArrivalDetails = [];
            $scope.flightDepartureDetails = [];
            $scope.securityTeamMembers = [];
            $scope.otherTeamMembers = [];
            $scope.teamMember = [];
            $scope.SurveyUrl = "";
            $scope.News =[];
            $scope.iswindows = false;
            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'City Alert',
                    template: $scope.tripdetails.tripAlerts.value
                });




            };
            if($scope.tripdetails.tripAlerts.value)
            {
                $scope.showAlert();

            }
            if(data.entities !== undefined) {

                if(data.entities) {

                for (var i = 0; i < data.entities.length; i++) {

                    switch(data.entities[i].class[0]) {
                        case 'EmbeddedNews':

                            $scope.showNews = true;
                            $scope.News.push(data.entities[i]);
                            break;
                        case 'ContactNumber':
                            $scope.contactnos.push(data.entities[i]);
                            break;

                        case 'Country':
                            $scope.countries.push(data.entities[i]);

                            break;
                        case 'EmbeddedFlightArrivalDetails':

                            $scope.flightArrivalDetails.push(data.entities[i]);

                            $scope.showflighttab =true;

                            break;
                        case 'EmbeddedFlightDepartureDetails':
                            $scope.flightDepartureDetails.push(data.entities[i]);
                            $scope.showflighttab =true;

                            break
                        case 'EmbeddedCkeditor':
                            $scope.ops.push(data.entities[i]);
                            $scope.showops = true;



                            break;
                        case 'EmbeddedImages':
                            $scope.ops.push(data.entities[i]);
                            $scope.showops = true;
                            break;


                        default:
                            break;
                    }

                }
            }
            }

            Restangular.one('?currentmodel='+ $scope.tripdetails.country.value ).get()
                .then(function(country) {

                    console.log(country);
                    $scope.country = country;

                    $scope.showAlert = function () {
                        var alertPopup = $ionicPopup.alert({
                            title: 'City Alert',
                            template: country.properties.countryWarnings.value
                        });

                    };
                    Application.hideLoading();

                    //if(country.properties.countryWarnings.value != "" && country.properties.countryWarnings.value !==null)
                    //{
                    //    $scope.showAlert();
                    //}

                });
            $scope.SurveyMonkeyUrl = $sce.trustAsResourceUrl(data.properties.surveyMonkeyUrl.value);
            $scope.AcuWeatherUrl = $sce.trustAsResourceUrl(data.properties.acuWeatherUrl.value);
            if(ionic.Platform.isWindowsPhone())
            {
              $scope.iswindows = true;

            }

             $scope.securityTeamMembers =  splitor(data.properties.securityTeam.value);
             $scope.operationalPlanPermissions  =  splitor(data.properties.operationalPlanPermissions.value);

            if($.inArray( userdata.id, $scope.operationalPlanPermissions )  > -1)
            {
                $scope.permissions = true
            }
            else {
                $scope.permissions = false;
            }

            $scope.otherTeamMemberArrays = splitor(data.properties.clientTeamContactInfo.value);
            var _teams = $scope.securityTeamMembers;
            for(var i=0;i<_teams.length;i++)
            {

                Restangular.one('?currentmodel='+ _teams[i] +'&children=true'+ '&nocache=true&resolvecontent=memberCountryVisiting').get()
                    .then(function(team) {
                        try {

                            if (team.entities.length > 0) {

                                for (var x =0; x<team.entities.length;x++) {
                                    switch (team.entities[x].class[0]) {
                                        case 'MemberCountryDetails':

                                            if($scope.country.properties.Id.value == team.entities[x].properties.memberCountryVisiting.value)
                                            {
                                              
                                                //team.properties.tmContactNo.value = team.entities[x].properties.memberCountryContactNumber.value;
                                                team.properties.tmContactNoLocal.value = team.entities[x].properties.memberCountryContactNumber.value;
                                                team.properties.tmVehicle.value = team.entities[x].properties.memberCountryVehicalDescription.value;
                                                team.properties.tmCarImage.value = team.entities[x].properties.memberCountryVehicleImage.value;
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

                        $scope.teams.push(team.properties);

                    });

            }
            var _teams2 = $scope.otherTeamMemberArrays;
            for(var i=0;i<_teams2.length;i++)
            {

                Restangular.one('?currentmodel='+ _teams2[i] +'&nocache=true&resolvecontent=teamMemberCountryDetails,MemberCountryDetails').get()
                    .then(function(oteam) {
                        try {
                            if (oteam.entities.length > 0) {
                                for (var x =0; x<oteam.entities.length;x++) {
                                    switch (oteam.entities[x].class[0]) {
                                        case 'MemberCountryDetails':

                                            if($scope.country.properties.Id.value == oteam.entities[x].properties.memberCountryVisiting.value)
                                            {
                                                oteam.properties.tmContactNoLocal.value = oteam.entities[x].properties.memberCountryContactNumber.value;
                                                team.properties.tmVehicle.value = team.entities[x].properties.memberCountryVehicalDescription.value;
                                                team.properties.tmCarImage.value = team.entities[x].properties.memberCountryVehicleImage.value;
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

                        $scope.oteams.push(oteam.properties);

                    });

            }



            //Restangular.one('?currentmodel='+ $scope.tripdetails.tripcountry.value + '&descendants=ContactNumber').get()
            //    .then(function(contactnos) {
            //
            //    $scope.contactnos = contactnos.entities;
            //
            //
            //
            //    });

            
            Restangular.all('?currentmodel='+ $scope.tripdetails.country.value +'?descendants=GeneralInfo' ).getList()
                .then(function(GeneralInfo) {
                    console.log('GeneralInfo->'+GeneralInfo);
                    $scope.GeneralInfo = GeneralInfo;



                });

        });


        $scope.url = Server.url;
    $scope.sendSMS = function(body) {
        $.post(
            "http://bulksms.2way.co.za/eapi/submission/send_sms/2/2.0",
            { username: "qz2rg4", password: "Access99" ,message:'ArcApp - ' + body,msisdn:"27833267925"},
                function(data){
                var alertPopup = $ionicPopup.alert({
                    title: 'Thank you',
                    template: 'A message has been sent -> ' + data
                });
            }
        );


    };

    $scope.showhtml = false;
    $scope.showimages = false;

    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    });
    $scope.openModal = function(data) {
        debugger;
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
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });









    $ionicModal.fromTemplateUrl('newsmodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.newsmodal = modal
    });

    $scope.openNewsModal = function(data) {

        for(var i = 0 ;i<$scope.News.length;i++)
        {
            if($scope.News[i].properties.bulletinTitle.value == data) {
               $scope.NewsDetails = $scope.News[i].properties.news.value;
            }
        }

        $scope.newsmodal.show()
    };

    $scope.closeNewsModal = function() {
        $scope.newsmodal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.newsmodal.remove();
    });




























    $ionicModal.fromTemplateUrl('profile-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal2) {
        $scope.modal2 = modal2
    });
    $scope.openModal2 = function( t) {

        $scope.tmprofile = t.tmprofile.value;
        $scope.modal2.show()
    };

    $scope.closeModal2 = function() {
        $scope.modal2.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal2.remove();
    });















    $ionicModal.fromTemplateUrl('flightstats-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(model) {

        $scope.fs = model;
    });

    $scope.openModalFlightStats = function(data) {

        var fl = data.properties.flightNumber.value.split(' ');
        var airline = fl[0];
        var no = fl[1];
        var start = new Date(data.properties.dateTime.value);

        var yyyy = start.getFullYear();
        var mm = start.getMonth()+1; // getMonth() is zero-based
        var dd  = start.getDate();
        var mydate = yyyy +'-' + mm +'-' + dd;
       var url =   'http://mobile.flightstats.com/go/Mobile/flightStatusByFlight.do?airline=%28'+airline +'%29&flightNumber='+no+'&departureDate='+mydate;
       $scope.flightstatsurl = $sce.trustAsResourceUrl(url);

        $scope.fs.show();

    };

    $scope.closeFlightStats = function() {
        $scope.fs.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.fs.remove();
    });



    function flightStatus (fnumber,date) {



        //var sdToken = "NGQxYTExNWYtNTdmYi00ZWIxLWIwZmItYTQ4ODY3OTdhNzI3";
        //var issApi = 'https://api.flightstats.com/v2/json/flight/status/' + airline + '/' + no +'/dep/'+ thedate.getFullYear()+'/' + month +'/'+ thedate.getDate()+'/'+'/?appId=ae9e66d6&appKey=6f5d2b87e43c9b7af14706ed92c920cb&utc=true';
        //var myEventSource = streamdataio.createEventSource(issApi, sdToken);
        //
        //// open the streamdata.io connection
        //myEventSource.open();
        //
        //myEventSource.onData(function(data){        // initialize your data with the initial snapshot
        //    $scope.flightStatus = data;
        //    if (eventSource) {
        //        eventSource.close();
        //        eventSource = null;
        //    }
        //
        //}).onPatch(function(data){                  // update the data with the provided patch
        //    $scope.flightStatus = data;
        //    if (eventSource) {
        //        eventSource.close();
        //        eventSource = null;
        //    }
        //});










    }




    $ionicModal.fromTemplateUrl('carpic-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(model) {

        $scope.cp = model;
    });

    $scope.openModalCarPic = function(data) {


        $scope.carpicurl = data.tmCarImage.value;

        $scope.cp.show();

    };

    $scope.closeCarPic = function() {
        $scope.cp.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.cp.remove();
    });









    $scope.surveyClicked = function() {
        $ionicTabsDelegate.$getByHandle('secondTab').select(4);
        Application.showLoading(true);
        setTimeout(function () {
            Application.hideLoading();
        }, 5000);


    };
    $scope.weatherClicked = function() {
        var currSrc = $("#weather").attr("src");
        $("#weather").attr("src", currSrc);
        $ionicTabsDelegate.$getByHandle('secondTab').select(2);
        Application.showLoading(true);
        setTimeout(function () {
            Application.hideLoading();
        }, 5000);


    }

};






appModule('app.mainPage').controller('opstripDetailsController', opstripDetailsController);
}());

