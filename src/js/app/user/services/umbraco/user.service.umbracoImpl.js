;(function () {
    "use strict";

    appModule('app.user')

        .service('UserServiceUmbracoImpl', function ($q, $log, loggingService, User, $resource, UserData,Restangular,Server,$rootScope,$localstorage) {

            var currentLoggedinUser = null;

            var userData = {
                userName: 'ad@min.com',
                emailVerified: true,
                password: 'password'
            };
            userData = null;
            function setCurrentUser(userData) {
                currentLoggedinUser = User.build(userData);

                return currentLoggedinUser;
            }

            var init = function () {

                setCurrentUser(userData);     // set logged in user at app startup
                // comment out the line above and uncomment the next line to require login at startup
                //setCurrentUser(null);     // no valid user at application init, forcing login at start up

                return currentLoggedinUser;
            };

            var currentUser = function () {
                return currentLoggedinUser;
            };

            // 'checked' version of 'currentLoggedinUser()' returning a promise
            var checkUser = function () {
                if (currentLoggedinUser) {
                    if (currentLoggedinUser.emailVerified) {
                        return $q.when(currentLoggedinUser);
                    } else {
                        return $q.reject({error: "userEmailNotVerified"});
                    }
                } else {
                    return $q.reject({error: "noUser"});
                }
            };

            var signup = function (user) {
                var deferred = $q.defer();

                logout();

                $log.debug("Signup start ...");

                if (user.password == userData.password) {
                    $log.debug("Signup done");

                    // note: we don't set/change the current user because the new user isn't logged in yet
                    deferred.resolve(User.build(userData));
                } else {
                    deferred.reject("unknown_error");
                }

                return deferred.promise;
            };

            var login = function (username, password) {


                var team = false;
                var deferred = $q.defer();
                deferred.reject("invalid_credentials");
                var items;
                logout();
                $localstorage.setObject('user', null);
                $log.debug("Login start ...");


               return  Restangular.one("/teams?nocache=true&descendants=TeamMember&where=teamMemberEmail.Contains('" + username + "')").withHttpConfig({cache: false}).get()
                    .then(function (td) {

                         var teammamberdata = td.entities;
                        try {

                            for(var i=0;i<teammamberdata.length;i++) {

                                switch (teammamberdata[i].class[0]) {
                                    case 'TeamMember':
                                        if (teammamberdata[i].properties === null) {
                                            // deferred.reject("invalid_credentials");
                                            //return deferred.promise;
                                        }
                                        if (teammamberdata[i].properties.teamMemberPassword.value == password) {
                                            team = true;

                                            var user = teammamberdata[i].properties;
                                            if (user.Id.value != null) {
                                                $log.debug("Login done");
                                                var userData = {
                                                    userName: user.Name.value,
                                                    emailVerified: true,
                                                    id: user.Id.value,
                                                    password: password,
                                                    url: user.url,
                                                    accessLevel: user.accessLevel.value,
                                                    viewLevel: user.viewLevel.value,
                                                    type: 'team'
                                                };

                                                $localstorage.setObject('user', userData);
                                                UserData.sendData(teammamberdata);
                                                deferred.resolve(setCurrentUser(userData));

                                            } else {
                                                return false;
                                            }
                                        }
                                        break;


                                    default:
                                        break;
                                }
                            }
                            if(!team) {
                               try {
                                  return Restangular.one('?descendants=Member&where=memberEmail.Contains(%27' + username + '%27)').withHttpConfig({cache: false}).get()
                                       .then(function (data) {

                                           items = data;


                                           try {

                                               if (items[0].properties === null) {
                                                   deferred.reject("invalid_credentials");
                                                   return deferred.promise;
                                               }
                                               if (items[0].properties.memberPassword.value != password) {
                                                   deferred.reject("invalid_credentials");
                                                   return deferred.promise;
                                               }

                                           } catch (err) {
                                               deferred.reject("invalid_credentials");
                                               return deferred.promise;
                                           }



                                           var user = items[0].properties;

                                           if (user == null) {
                                               deferred.reject("invalid_credentials");
                                           }
                                           else if (user.Id.value != null) {
                                               $log.debug("Login done");
                                               var userData = {
                                                   userName: user.Name.value,
                                                   emailVerified: true,
                                                   id: user.Id.value,
                                                   password: password,
                                                   url: user.url,
                                                   accessLevel: user.accessLevel,
                                                   viewLevel: user.viewLevel,
                                                   type: 'client'
                                               };
                                               $localstorage.setObject('user', userData);
                                               UserData.sendData(data);
                                               deferred.resolve(setCurrentUser(userData));
                                           } else {
                                               deferred.reject("invalid_credentials");
                                           }


                                       });


                               } catch (err) {
                                   deferred.reject("invalid_credentials");
                                   return deferred.promise;

                               }



                            }
                        } catch (err) {
                            deferred.reject("invalid_credentials");
                            return deferred.promise;

                        }
                    });





            };

            var logout = function () {
                setCurrentUser(null);
            };

            var resetPassword = function (email) {
                var deferred = $q.defer();

                logout();

                $log.debug("Password reset start ...");
                $log.debug("Password reset done");

                deferred.resolve();

                return deferred.promise;
            };

            return {
                init: init,
                currentUser: currentUser,
                checkUser: checkUser,
                signup: signup,
                login: login,
                logout: logout,
                resetPassword: resetPassword
            };
        })
    ;
}());
