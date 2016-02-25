;(function () {
  "use strict";

  var LoginCtrl = /*@ngInject*/function ($scope, $state, $stateParams, Application, UserService, $translate,
                                         $ionicContentBanner,$rootScope,$localstorage) {
    var vm = this;
    var isIOS = ionic.Platform.isIOS();
    $scope.hidelogo =false;
    $scope.$on('$ionicView.beforeEnter', function () {
      // enforce/ensure no logged in user at this point
      UserService.logout();
      vm.version = $rootScope.version;
      Application.resetForm(vm);

      vm.user = $localstorage.getObject('login');

      //vm.user = {
      //  username: 'anton@interon.co.za' ,
      //  password: 'password'
      //};


    });
    $scope.focus = function(){
     if(isIOS)
     {
       return;
     }
      $scope.hidelogo =true;
    }
    $scope.blur = function(){
      if(isIOS)
      {
        return;
      }
      $scope.hidelogo =false;
    }
    var closeContentBanner = null;

      // the ionic-content-banner needs to be displayed in the 'enter' event because it will only work if the view
      // is displayed completely
      $scope.$on('$ionicView.enter', function () {

        if ($stateParams.verifyEmail) {
          var messageKey;
          var messageParams;

          if ($stateParams.verifyEmail === 'verify') {
            messageKey = 'message.check-your-email';
          } else {    // $stateParams.verifyEmail === 'notVerified'
            messageKey = 'message.email-not-verified';
          }

          $translate(messageKey).then(function (translation) {
            closeContentBanner = $ionicContentBanner.show({text: [translation]});
          });
        }
    });

    // before we leave the view then close/destroy the ionic-content-banner, if any
    $scope.$on('$ionicView.beforeLeave', function () {
      if (closeContentBanner) {
        closeContentBanner();
      }
    });

    vm.login = function (form) {

      if (!form.$valid) {
        vm.user = {
          username: '' ,
          password: ''
        };

        $localstorage.setObject('login', vm.user);
        return;
      }
   
      Application.showLoading(true);

      UserService.login(('' + vm.user.username).toLowerCase(), vm.user.password).then(function (loggedinUser) {
               //Ionic.io();
            //var user = Ionic.User.current();
            //// if the user doesn't have an id, you'll need to give it one.
            //if (!user.id) {
            //  //user.id = Ionic.User.anonymousId();
            //  user.id =  UserService.email;
            //  user.set('Country', $rootScope.country.name);
            //}
            //user.save();
        Application.hideLoading();

        // user logged in implies the user is registered
        Application.setUserRegistered(true);

            $localstorage.setObject('login', vm.user);
           // $rootScope.$on("data_shared",function(){
             // debugger;
              var userdata =   $localstorage.getObject('user');
            if(!userdata)
            {
              vm.errorMessage('message.invalid-credentials');
              return;
            }
              if (userdata.type=='team')
              {
                $state.go('opstriplist');
              }
              else
              {
                $state.go('demo');
              }

             // Application.gotoStartPage($state);

           // })

      })
        .catch(function (error) {

          Application.hideLoading();

          // login failed, check error to see why
          if (error == "invalid_credentials") {
            vm.errorMessage('message.invalid-credentials');
          } else if (error == "not_verified") {
            vm.errorMessage('message.email-not-verified');
          } else {
            vm.errorMessage('message.unknown-error');
          }
        });
    };

    vm.forgot = function () {
      $state.go('forgotPassword');
    };

    vm.signup = function () {
      $state.go('signup');
    };

    vm.intro = function () {
      Application.gotoIntroPage($state);
    };

    vm.errorMessage = function (key, vars) {
      $translate(key, vars || {}).then(function (translation) {
        vm.error.message = translation;
      });
    };

  };

  appModule('app.auth.login').controller('LoginCtrl', LoginCtrl);
}());
