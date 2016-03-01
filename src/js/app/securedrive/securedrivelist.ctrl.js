;(function() {
"use strict";

var securedriveListCtrl = /*@ngInject*/function ($scope,$rootScope, $ionicSideMenuDelegate,loggingService,Application,$ionicNavBarDelegate,$state,UserData,Restangular,Server,$cordovaGlobalization,$ionicModal,$sce,$interval) {
    $scope.goTo = function (hash) {
        console.log('goTo clicked - '+ hash);
        $state.go(hash);
    };
 $scope.$on('$ionicView.enter', function () {

    $ionicNavBarDelegate.showBar(true);


    });

    $scope.w =  window.screen.width;
    $scope.h = window.screen.height;

    if ($scope.w > 1000) {$scope.w =350;}


        $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.surveymonkeyUrl);

 var data = UserData.getData();

    var user =  data[0];
    $scope.url = Server.url;
    //$scope.items = Restangular.all(user.properties.Url +'/secure-drive?children=true').getList().$object;
    Restangular.all(user.properties.Url +'/secure-drive?children=true').getList()  // GET: /users
        .then(function(data) {

        $scope.items = data;

        })

    $scope.url = Server.url;
    $scope.country = $rootScope.country;

    var url = $scope.country.url;
    Restangular.one(url ).get()
        .then(function(data) {

            $scope.ContactNumbers =[];
            $scope.countryinfo = data;
            for(var i=0;i<data.entities.length;i++) {
                switch (data.entities[i].class[0]) {
                    case 'ContactNumber':
                        $scope.ContactNumbers.push(data.entities[i]);

                    default:
                        break;
                }

            }

        });

    $ionicModal.fromTemplateUrl('car-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal1) {
        $scope.modal1 = modal1
    })
    $scope.openModal1 = function(driver) {


        Restangular.all('/team/?descendants=TeamMember&where=Id eq ' + driver ).getList()
            .then(function(teammemberdata) {

                $scope.teammemberdata =  teammemberdata[0].properties;


            });
        $scope.url = Server.url;

        $scope.modal1.show()
    }

    $scope.closeModal1 = function() {
        $scope.modal1.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal1.remove();
    });



    $ionicModal.fromTemplateUrl('team-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal2) {
        $scope.modal2 = modal2
    })
    $scope.openModal2 = function( team) {
        $scope.teamarray = team.split(',');

        $scope.modal2.show()
    }

    $scope.closeModal2 = function() {
        $scope.modal2.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal2   .remove();
    });







$scope.iframeload = function(){

try {
    var f = $('#f');

    f.contents().find('footer').hide();
    f.contents().find('a').hide();



}
    catch(e)
   {

    }


}
    $scope.callAtInterval = function() {
        if($("#f").contents().text().search("Thank you for completing our survey!")!=-1){
            $interval.cancel($scope.callAtInterval);
            $scope.closeModal3();
        }
    }





var count = 0;






    $ionicModal.fromTemplateUrl('survey-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal3) {
        $scope.modal3 = modal3
    })
    $scope.openModal3 = function(trip) {



        Restangular.one(user.properties.Url +'/secure-drive/'+ trip.replace(/ /g,'-')).get()
            .then(function(data) {

               var sm = data.properties.secureDriveSurveyMonkeyUrl.value;
                if (!sm)
                {
                    Restangular.one($rootScope.country).get()
                        .then(function(data) {

                          sm =  data.properties.secureDriveSurveyMonkeyUrl.value;
                        });
                }
                $scope.secureDriveSurveyMonkeyUrl = $sce.trustAsResourceUrl(sm);

            });
        $scope.url = Server.url;
        Application.showLoading(true);
        setTimeout(function () {
            Application.hideLoading();
    }, 5000);
        $interval( function(){ $scope.callAtInterval(); }, 5000);
        $scope.modal3.show()
    }

    $scope.closeModal3 = function() {
        Application.hideLoading();
        $scope.modal3.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal3.remove();
    });   
    
    
    
    
    
    
    
    
    
    
    
    
    
};

appModule('app.mainPage').controller('securedriveListCtrl', securedriveListCtrl);
}());
