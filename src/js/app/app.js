;(function () {
  "use strict";

//
// app.js
//
// Main application sript
//

// Declare the 'app.config' module, this is because config.js is generated and doesn't the app.config module itself
  angular.module('app.config', []);
 

//
// Declare the main 'app' module and state its dependencies. All of the other modules will "declare themselves".
//
// NOTE: looked at gulp-angular-modules (https://github.com/yagoferrer/gulp-angular-modules) which should make it
// possible to get rid of manually managing the list of dependencies. However, I couldn't get this to work.
//





  angular.module('app', [
    // libraries
    'ionic', 'ionic.service.core', 'ionic.service.analytics',  'nemLogging', 'ngGeolocation', 'uiGmapgoogle-maps',// IONIC.IO (Alpha software - disable for production?)
    'firebase',
    'ngCordova', 'ngMessages', 'fusionMessages', 'ngIOS9UIWebViewPatch',
    // angular-translate
    'pascalprecht.translate',
    // ionic-content-banner
    'jett.ionic.content.banner','ngResource',"hateoas","restangular","ngOnload","ngSanitize",
    // config
    'app.config',
    // generic services
    'app.util', 'app.firebase',
    // app services
    'app.user', 'app.tracking',
    // controllers and routers
    'app.intro', 'app.auth.signup', 'app.auth.login', 'app.auth.forgotPassword', 'app.mainPage','app.sms',
    // ANGULAR-TEMPLATECACHE
  'templates'
  ])


      .directive('logo', function() {
  return {
    templateUrl: 'js/app/arcapp/logo.html',
      controller : function ($scope,$rootScope){
          $scope.showversion = false;
          $scope.version = $rootScope.version;



      }
  }})
      .directive('contactno', function() {
          return {
              replace: true,
              transclue: true,
              templateUrl: 'js/app/arcapp/contactno.html',
              scope: {
                  contactno: '@',
                  title:'@'
              }

          }})
      .directive('driver', function() {
          return {
              replace: false,
              transclue: true,
              templateUrl: 'js/app/arcapp/driver.html',
              scope: {
                  nodeid: '@'
              },
              controller: function ( $scope,Restangular,Application,Server) {

                  var info = Restangular.all('/team/?where=id='+$scope.nodeid+'&descendants=TeamMember').getList().$object;
                  console.log(info);
                  $scope.driver = info;
                  $scope.url = Server.url;
              }
}})
      .directive('driverimage', function() {
          return {
              replace: false,
              transclue: true,
              templateUrl: 'js/app/arcapp/driverimage.html',
              scope: {
                  nodeid: '@',
                  mystyle: '@'
              },
              controller: function ( $scope,Restangular,Application,Server) {

                  var info = Restangular.all('/team/?where=id='+$scope.nodeid+'&descendants=TeamMember').getList().$object;
                  $scope.driver = info;
                  $scope.url = Server.url;
              }
          }})
      .directive('teammember', function() {
          return {
              replace: true,
              transclue: true,
              templateUrl: 'js/app/arcapp/teammember.html',
              scope: {
                  nodeid: '@',
                  mystyle: '@'
              },
              controller: function ( $scope,Restangular,Application,Server) {


                  Restangular.all('/team/?where=id='+$scope.nodeid+'&descendants=TeamMember').getList()  // GET: /users
                      .then(function(data) {
                          $scope.tm = data[0];

                      });



                  $scope.url = Server.url;
              }
          }})
      .directive('teamlist', function() {
          return {
              replace: true,

              templateUrl: 'js/app/arcapp/teamlist.html',
              scope: {
                  teamlist: '@'

              }

          }})
      //.directive('carimage', function() {
      //    return {
      //        replace: true,
      //        transclue: true,
      //        templateUrl: 'js/app/arcapp/carimage.html',
      //        scope: {
      //            nodeid: '@',
      //            mystyle: '@'
      //
      //        },
      //        controller: function ( $scope,Restangular,Application,Server) {
      //
      //            var info = Restangular.all('/team/?where=id='+$scope.nodeid+'&descendants=TeamMember').getList().$object;
      //            console.log(info);
      //            $scope.driver = info;
      //            $scope.url = Server.url;
      //        }
      //    }})
      .directive('cardetails', function() {
          return {
              replace: true,
              transclue: true,
              templateUrl: 'js/app/arcapp/carimage.html',
              scope: {
                  obj: '@'

              }

          }})
      .directive('triplistSideMenu', function(Application) {
  return {
    templateUrl: 'js/app/arcapp/rightmenu.html',
    controller:'ApplicationCtrl'
  
  }})
      .filter('hrefToJS', function ($sce, $sanitize) {
          return function (text) {
              var regex = /href="([\S]+)"/g;
              var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
              return $sce.trustAsHtml(newString);
          }
      })


        .filter('img2server', function ($sce, $sanitize) {
            return function (text) {

                return $sce.trustAsHtml($sanitize(text).replace(/(src=")(?!https?:\/\/)\/?([^"]+\.(jpe?g|png|gif|bmp))"/ig, '$1http://arcapp.interon.co.za/$2"'));
            }
        })
      .filter('safe', function ($sce, $sanitize) {
          return function (text) {

              return $sce.trustAsHtml(text);
          }
      })

      .directive('spacer', function () {
          return {
              template: '<div ng-show="windows" class="spacer" style="height: 100px;"></div><div ng-show="android" class="spacer" style="height: 100px;"></div><div ng-show="ios" class="spacer" style="height: 120px;"></div>',

          controller: function ( $scope) {

              $scope.ios = ionic.Platform.isIOS();
              $scope.android = ionic.Platform.isAndroid();
              $scope.windows = ionic.Platform.isWindowsPhone();
          }

      }})
      .directive('spacersmall', function () {
          return {
              template: '<div ng-show="windows" class="spacer" style="height: 100px;"></div><div ng-show="android" class="spacer" style="height: 100px;"></div><div ng-show="ios" class="spacer" style="height: 120px;"></div>',

          controller: function ( $scope) {

              $scope.ios = ionic.Platform.isIOS();
              $scope.android = ionic.Platform.isAndroid();
              $scope.windows = ionic.Platform.isWindowsPhone();
          }

      }})
      .directive('spacerbig', function () {
          return {
              template: '<div ng-show="windows" class="spacer" style="height: 100px;"></div><div ng-show="android" class="spacer" style="height: 120px;"></div><div ng-show="ios" class="spacer" style="height: 140px;"></div>',

          controller: function ( $scope) {

              $scope.ios = ionic.Platform.isIOS();
              $scope.android = ionic.Platform.isAndroid();
               $scope.windows = ionic.Platform.isWindowsPhone();
          }

      }})
   .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization,places'
    })
})
    .config(function(RestangularProvider) {
        RestangularProvider.setBaseUrl('http://arcapp.interon.co.za/');

        RestangularProvider.setResponseExtractor(function(response, operation) {

            if(operation=="getList")
            {
                return response.entities;
            }
            if(operation=="get")
            {
                return response;
            }
            if(typeof(response.entities) == "undefined")
            {
                return response.properties;
            }
            else
            {
                return response;
           }
        });

        RestangularProvider.setDefaultHttpFields({cache: false});
        RestangularProvider.setMethodOverriders(["put", "patch"]);
        RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
        RestangularProvider.setErrorInterceptor(

            function ( response ) {

            });

       /* RestangularProvider.setRequestSuffix('.json');

        // Use Request interceptor
        RestangularProvider.setRequestInterceptor(function(element, operation, route, url) {
            delete element.name;
            return element;
        });

        // ..or use the full request interceptor, setRequestInterceptor's more powerful brother!
        RestangularProvider.setFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
            delete element.name;
            return {
                element: element,
                params: _.extend(params, {single: true}),
                headers: headers,
                httpConfig: httpConfig
            };
        });*/

    })
     // .constant('FBREF', new Firebase('https://arcapp.firebaseio.com'))
      .constant('ServerUrl','http://arcapp.interon.co.za' )

    //.config(function (HateoasInterceptorProvider) {
    //    HateoasInterceptorProvider.transformAllResponses();
    //})
      .config(function(uiGmapGoogleMapApiProvider) {
          uiGmapGoogleMapApiProvider.configure({
              //key: 'AIzaSyAc8Bwqfc1l1fTKzKo5cZYtiatEDb5Ox4s',
              libraries: 'places,geometry,visualization',
              v: '3.17'
          });
      })


    .config(function ($stateProvider) {

      // top level routes (all other routes are defined within their own module)
      $stateProvider

        .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "js/app/menu/menu.html"
        })
         .state('demo', {
          url: "/demo",
             cache: false,
             reload:true,
          templateUrl: "js/app/mainpage/demo.html"

        })
 .state('admin', {
          url: "/admin",
          templateUrl: "js/app/admin/admin.html"
 })
          .state('emergency', {
              url: "/emergency",
              templateUrl: "js/app/sms/sms.html",
              reload:true
          })
          .state('triplist', {
              url: "/triplist",
              templateUrl: "js/app/tripmanagement/home/triplist.html",
              cache: false,
              reload:true
          })
          .state('opstriplist', {
              url: "/opstriplist",
              templateUrl: "js/app/tripmanagement/home/opstriplist.html",
              cache: false,
              reload:true
          })
          .state('opstripdetails', {
              url: "/opstripdetails",
              templateUrl: "js/app/tripmanagement/home/opstripdetails.html",
              cache: false,
              reload:true,
              params:{
                  Id: {
                      value: null

                  }}

          })
          .state('tripdetails', {
              url: "/tripdetails",
              templateUrl: "js/app/tripmanagement/home/tripdetails.html",
              cache: false,
              reload:true,
              params:{
              Id: {
                  value: null

              }}

          })
           .state('weather', {
              url: "/weather",
              templateUrl: "js/app/tripmanagement/weather/weatherlist.html",
               reload:true
          })
          .state('maps', {
              url: "/maps",
              templateUrl: "js/app/tripmanagement/locations/maps.html",
              reload:true
          })
          .state('opps', {
              url: "/opps",
              templateUrl: "js/app/tripmanagement/operationalplan/operation.html",
              reload:true
          })
          .state('alerts', {
              url: "/alerts",
              templateUrl: "js/app/tripmanagement/alerts/alerts.html",
              reload:true
          })
          .state('countryInfo', {
              url: "/countryInfo",
              templateUrl: "js/app/tripmanagement/countryinformation/countryInfo.html"
          })
          .state('secureDrive', {
              url: "/secureDrive",
              cache: false,
              templateUrl: "js/app/securedrive/securedrive.html",
              reload:true
          })
          .state('secureDriveList', {
              url: "/secureDriveList",
              templateUrl: "js/app/securedrive/securedrivelist.html",
              cache: false,
              reload:true
          })


        //
        // All UI-router states that are children of 'app.auth' need a valid user - this is enforced through a Route
        // Resolve, as you can see below ("UserService.checkUser()")
        //
        // When the resolve fails (meaning the user is not logged in), then "$rootScope.$on('$stateChangeError'..." (see
        // below) is triggered, which then redirects the app to the login page.
        //
        // This technique was inspired by:
        //
        // http://www.clearlyinnovative.com/starter-ionic-application-template-wparse-integration
        //

        .state('app.auth', {
          url: "/auth",
          abstract: true,
          template: '<ion-view/>',
          resolve: {
            user: function (UserService) {
              return UserService.checkUser();
            }
          }
        });
    })

    .config(function ($ionicConfigProvider) {

      // http://forum.ionicframework.com/t/change-hide-ion-nav-back-button-text/5260/14
      // remove back button text, use unicode em space characters to increase touch target area size of back button
      $ionicConfigProvider.platform.ios.navBar.alignTitle('left');
$ionicConfigProvider.backButton.text('').icon('ion-chevron-left').previousTitleText(false);
      // NOTE: we put the tabs at the top for both Android and iOS
      $ionicConfigProvider.tabs.position("top");
       // $ionicConfigProvider.views.maxCache(0);
      //$ionicConfigProvider.navBar.alignTitle('center');
      //
      //$ionicConfigProvider.navBar.positionPrimaryButtons('left');
      //$ionicConfigProvider.navBar.positionSecondaryButtons('right');
    })
      .config(function($httpProvider) {
          delete $httpProvider.defaults.headers.common['X-Requested-With'];
      })
    .config(function ($logProvider, APP) {

      // switch off debug logging in production
      $logProvider.debugEnabled(APP.devMode); // default is true
    })

    .config(function ($compileProvider, APP) {

      // switch off AngularJS debug info in production for better performance
      $compileProvider.debugInfoEnabled(APP.devMode);
    })

    .config(function ($ionicAppProvider, ionicIO) {
      $ionicAppProvider.identify({
        app_id: ionicIO.appId,
        api_key: ionicIO.apiKey
      });
    })

    .config(function ($translateProvider) {
      $translateProvider
        .useStaticFilesLoader({
          prefix: 'js/locales/',
          suffix: '.json'
        })
        .registerAvailableLanguageKeys(['en'], {
          'en': 'en', 'en_GB': 'en', 'en_US': 'en'
        })
        .preferredLanguage('en')
        .fallbackLanguage('en')
        .useSanitizeValueStrategy('escapeParameters');
    })
 
    .factory('$exceptionHandler', function ($log) {

      // global AngularJS exception handler, see:
      // http://blog.pdsullivan.com/posts/2015/02/19/ionicframework-googleanalytics-log-errors.html
      return function (exception, cause) {
        exception.message += ' (caused by "' + cause + ')", stack: ' + exception.stack;
        $log.error("error: " + exception);
      };
    })

    .run(function ($ionicPlatform, $ionicPopup, $ionicSideMenuDelegate, $ionicHistory, $state, $rootScope, $translate,$timeout,
                   $log, loggingDecorator, Application, APP, Tracking,LocationService,Restangular) {

      loggingDecorator.decorate($log);

        _.contains = _.includes

        $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams, error) {

          $log.debug('$stateChangeError, to: ' + JSON.stringify(toState) + ' error: ' + JSON.stringify(error));

          // If the error is "noUser" then go to login state. For explanation see comments above. Technique inspired by:
          // http://www.clearlyinnovative.com/starter-ionic-application-template-wparse-integration
          if (error && (error.error === "noUser" || error.error === "userEmailNotVerified")) {

            // event.preventDefault(): this is necessary to keep Ionic from loading the login page TWICE. See:
            // http://stackoverflow.com/questions/22936865/handling-error-in-ui-routers-resolve-function-aka-statechangeerror-passing-d
            event.preventDefault();

            $state.go('login', error.error === "userEmailNotVerified" ? {verifyEmail: 'notVerified'} : {});
          }
        });

      $ionicPlatform.ready(function () {

          try {
              var hcp = {

                  // Application Constructor
                  initialize: function () {
                      console.log('hcp - > Init');
                      hcp.configurePlugin();
                  },


                  configurePlugin: function () {
                      console.log('hcp - > configurePlugin');
                      var options = {
                          'config-file': 'https://s3-us-west-2.amazonaws.com/arcapp/chcp.json'
                      };

                      chcp.configure(options, this.configureCallback);
                  },

                  configureCallback: function (error) {
                      console.log('hcp - > configureCallback');
                      if (error) {
                          console.log('Error during the configuration process');
                          console.log(error.description);
                          if (error.description) {
                          console.log(error.description)
                          }
                      } else {
                          console.log('Plugin configured successfully');
                          hcp.checkForUpdate();
                      }
                  },

                  checkForUpdate: function () {
                      console.log('hcp - > checkForUpdate');
                      chcp.fetchUpdate(this.fetchUpdateCallback);
                  },

                  fetchUpdateCallback: function (error, data) {
                      console.log('hcp - > checkForUpdate');
                      if (error) {
                          console.log('Failed to load the update with error code: ' + error.code);
                          console.log(error.description);
                          return;
                      }
                      console.log('Update is loaded, running the installation');

                      chcp.installUpdate(this.installationCallback);
                  },

                  installationCallback: function (error) {
                      console.log('hcp - > installationCallback');
                      if (error) {
                          console.log('Failed to install the update with error code: ' + error.code);
                          console.log(error.description);
                      } else {
                          console.log('Update installed!');
                          $ionicPopup.confirm({
                                  title: "Update",
                                  content: "New update installed. Restart the app?"
                              })
                              .then(function(result) {
                                  if(!result) {
                                      ionic.Platform.exitApp();
                                  }
                              });
                      }
                  }
              };

              hcp.initialize();
          }catch  (err)
          {
              console.log(err);
          }
          //var div = document.getElementById("map_canvas");
          //var map = plugin.google.maps.Map.getMap(div);

         // console.log('AppUpdater->'+AppUpdater('http://localhost:3000/mobile_app/app_info'));
         // HockeyApp.init(
         //     [ '8d0c0e28df174b3684fcb2b8c7bd8115', true, true ],
         //     function() { console.log('hockeyapp initialised'); },
         //     function(msg) { console.log(msg); });
          //var io = Ionic.io();
          //var push = new Ionic.Push({
          //    "debug": true
          //});
          //
          //push.register(function(token) {
          //    console.log("Device token:",token.token);
          //});
          if(window.Connection) {
              if (navigator.connection.type == Connection.NONE) {
                  $ionicPopup.alert({
                          title: "Internet Disconnected",
                          content: "The internet is disconnected on your device."
                      })
                      .then(function (result) {
                          if (!result) {
                              $ionicPopup.alert({
                                  title: "Phone Error",
                                  content: "Network can not be detected"
                              })
                              ionic.Platform.exitApp();
                          }
                      });
                  ionic.Platform.exitApp();
              }

          }
          if(window.Connection) {
              if (navigator.connection.type == Connection.CELL_2G) {
                  $ionicPopup.alert({
                          title: "Slow Network Speed",
                          content: "This application might malfunction because if slow network speeds"
                      })
                      .then(function (result) {
                          if (!result) {
                              $ionicPopup.alert({
                                  title: "Phone Error",
                                  content: "Network can not be detected"
                              })
                              ionic.Platform.exitApp();
                          }
                      });
              }

          }
          try {
              cordova.getAppVersion(function (version) {
                  $rootScope.version = version + '.'+ APP.SubVersion;
              });
          }
          catch (e)
          {
              $rootScope.version = "0.00." + APP.SubVersion;
          }
          LocationService.getCurrentLocation().then(function (location,lon,lat) {

              var countrycode = location.split(',')[1];
              var lon = location.split(',')[2];
              var lat = location.split(',')[3];
              var c = Application.countries;
              var _country = '';
              var country = jlinq.from(c)
                  .equals('code', countrycode.trim())
                .select();
              var c = {
                  code:'',
                  name:'',
                  url:'',
                  lat:'',
                  lon:''
              }
              _country = country[0].name;
              c.code = country[0].code;
              c.name = country[0].name;
              c.nodeid ='';
              c.url = _country.replace(/\s+/g, '-').toLowerCase();
              c.lon = lon;
              c.lat = lat;

             $rootScope.country = c;

          }, function () {

              showError('Error retrieving current location!', 'Your location could not be retrieved. Please make sure you have your GPS Location Services enabled and your network allows the retrieval.');
          });
          function showError(title, text) {
              $ionicPopup.alert({
                  title: title,
                  template: text
              });
          }


          if(window.Connection) {
              if(navigator.connection.type == Connection.NONE) {
                  $ionicPopup.alert({
                          title: "Internet Disconnected",
                          content: "The internet is disconnected on your device."
                      })
                      .then(function(result) {
                          if(!result) {
                              ionic.Platform.exitApp();
                          }
                      });
              }

          }
          if(window.Connection) {
              if(navigator.connection.type == Connection.CELL_2G) {
                  $ionicPopup.alert({
                          title: "Internet Slow",
                          content: "The internet is extremely slow App might not respond"
                      })
                      .then(function(result) {
                          if(!result) {
                              ionic.Platform.exitApp();
                          }
                      });
              }
          }
          if(window.Connection) {
              if(navigator.connection.type == Connection.ETHERNET || navigator.connection.type == Connection.UNKNOWN) {
                  setTimeout(function() {
                      try {


                  Restangular.one('/teams/&nocache=true').get()
                      .then(function(data) {
                          if(!data)
                          {
                              $ionicPopup.alert({
                                      title: "Can't locate Server",
                                      content: "Server not found. Error 404"
                                  })
                                  .then(function() {

                                          ionic.Platform.exitApp();

                                  });
                          }
                      });
                      }catch(e){}
                      $ionicPopup.alert({
                              title: "Internet Disconnected",
                              content: "The internet is disconnected on your device."
                          })
                          .then(function() {

                                  ionic.Platform.exitApp();

                          });
                  }, 30000);
                  $ionicPopup.alert({
                          title: "Internet Disconnected",
                          content: "The internet is disconnected on your device."
                      })
                      .then(function(result) {
                          if(!result) {
                              ionic.Platform.exitApp();
                          }
                      });
              }
          }

          // tracking/analytics (Ionic.io)
        Tracking.init({
          // SET TO FALSE TO ENABLE IONIC.IO TRACKING, IF SET TO TRUE THEN THE IONIC ANALYTICS LIB DOES NOTHING
          dryRun: APP.noTracking
        });

        // hide or show the accessory bar by default (set the value to false to show the accessory bar above the keyboard
        // for form inputs - see: https://github.com/driftyco/ionic-plugin-keyboard/issues/97 and
        // http://forum.ionicframework.com/t/ionic-select-is-missing-the-top-confirm-part-in-ios/30538
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
          if (window.StatusBar) {
              StatusBar.styleDefault();
          }

        // Add the ability to close the side menu by swiping to te right, see:
        // http://forum.ionicframework.com/t/bug-ionic-beta-14-cant-close-sidemenu-with-swipe/14236/17
        document.addEventListener('touchstart', function (event) {
          if ($ionicSideMenuDelegate.isOpenLeft()) {
            event.preventDefault();
          }
        });

        // Prevent the Android hardware back button from exiting the app 'unvoluntarily' - ask the user to confirm; see:
        //
        // http://www.gajotres.net/ionic-framework-handling-android-back-button-like-a-pro/
        // http://forum.ionicframework.com/t/handling-the-hardware-back-buttons/1505/23
        //
        // If more flexibility is needed then one can implement something along these lines:
        //
        // https://gist.github.com/kyletns/93a510465e433c1981e1
        //
        $ionicPlatform.registerBackButtonAction(function (event) {

          if ($ionicHistory.backView() === null) {  // no more previous screen in the history stack, so "back" would exit
            //var key = 'exit-popup.';
            //
            //$translate([key + 'title', key + 'text', key + 'ok-button', key + 'cancel-button']).then(function (translations) {
            //
            //  $ionicPopup.confirm({
            //    title: translations[key + 'title'],
            //    template: translation,
            //    cancelText: translations[key + 'cancel-button'],
            //    okText: translations[key + 'ok-button']
            //  }).then(function (res) {
            //    if (res) {
            //      ionic.Platform.exitApp();
            //    }
            //  });
            //
            //});

          } else {
            $ionicHistory.goBack();
          }
        }, 100);  // 100 = previous view

        Application.init();
          setTimeout(function() {
              try {
                  navigator.splashscreen.hide();
              }catch(e){}

          }, 1000);
        Application.gotoStartPage($state);

      });
    });

    

 
}());
