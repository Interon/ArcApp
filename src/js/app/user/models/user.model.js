;(function() {
  "use strict";

  appModule('app.user',['$rootScope'])

    //
    // A simple model object.
    //
    // Inspired by: https://medium.com/opinionated-angularjs/angular-model-objects-with-javascript-classes-2e6a067c73bc
    //
      .factory('UserData', function ($rootScope) {
          var service = {};
          service.data = false;
          service.sendData = function(data){
              this.data = data;
              $rootScope.$broadcast('data_shared');
          };
          service.getData = function(){
              return this.data;
          };
          return service;

          function UserData(data)
          {
              this.data = data;

          }


        return service;
      })

    .factory('User', function () {

      /**
       * Constructor, with class name
       */
      function User(userName, createdAt, emailVerified, id,url,accessLevel,viewLevel,type) {
        // Public properties, assigned to the instance ('this')
        this.userName = userName;
        this.createdAt = createdAt;
        this.emailVerified = emailVerified;
        this.id = id;
          this.url = url;
              this.accessLevel = accessLevel;
              this.viewLevel = viewLevel;
              this.type = type;
      }

      /**
       * Public method, assigned to prototype
       */
      User.prototype.getLoggedInDuration = function () {
        return (new Date()).getTime() - this.createdAt.getTime();
      };

      /**
       * Static method, assigned to class
       * Instance ('this') is not available in static context
       */
      User.build = function (data) {
        if (!data) {
          return null;
        }

        return new User(
          data.userName,
          new Date(),
          data.emailVerified,
          data.id,
            data.url,
            data.accessLevel,
            data.viewLevel,
            data.type
        );
      };

      /**
       * Return the constructor function ('class')
       */
      return User;
    })

  ;
}());
