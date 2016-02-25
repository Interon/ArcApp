;(function() {
    "use strict";

    appModule('app.mainPage')
        .service('GlobService', function ($cordovaGlobalization) {



          var LocaleName =   $cordovaGlobalization.getLocaleName().then(
                function (result) {
                    // result
                },
                function (error) {
                    // error
                });

          return {
              language: lanuage,
              LocaleName: LocaleName
          }
        })
}());
